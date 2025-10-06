# models/database_model.py

import sqlite3
import os
import threading

class Database:
    def __init__(self):
        """
        Verbindt met de SQLite-database en initialiseert een lock
        om gelijktijdige toegang vanuit meerdere threads veilig te maken.
        """
        base_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.abspath(os.path.join(base_dir, '..'))
        self.database_path = os.path.join(project_root,'..', 'database', 'database.db')
        print(f"Database path: {self.database_path}")
        self._lock = threading.Lock()

    def connect(self):
        """
        Opent een nieuwe SQLite-verbinding met check_same_thread uitgeschakeld,
        zodat elke thread zijn eigen verbinding kan gebruiken.
        """
        self.conn = sqlite3.connect(self.database_path, check_same_thread=False)
        self.cursor = self.conn.cursor()

    def database_all(self, query, parameter=()):
        """
        Voert een SELECT uit en retourneert alle resultaten als lijst.
        """
        with self._lock:
            try:
                self.connect()
                self.cursor.execute(query, parameter)
                return self.cursor.fetchall()
            except sqlite3.Error as error:
                print(f"De database geeft een error: {error}")
                return []
            finally:
                self.conn.close()

    def database_one(self, query, parameter=()):
        """
        Voert een SELECT uit en retourneert één resultaat (tuple) of None.
        """
        with self._lock:
            try:
                self.connect()
                self.cursor.execute(query, parameter)
                return self.cursor.fetchone()
            except sqlite3.Error as error:
                print(f"De database geeft een error: {error}")
                return None
            finally:
                self.conn.close()

    def database_rest(self, query, parameter=(), row_id=False):
        """
        Voert een INSERT/UPDATE/DELETE uit. Bij row_id=True retourneert
        de laatste gegenereerde rij-id.
        """
        with self._lock:
            try:
                self.connect()
                self.cursor.execute("PRAGMA foreign_keys=ON")
                self.cursor.execute(query, parameter)
                self.conn.commit()
                if row_id:
                    return self.cursor.lastrowid
                return True
            except sqlite3.Error as error:
                print(f"De database geeft een error: {error}")
                return False
            finally:
                self.conn.close()

    def database_one_dict(self, query, parameter=()):
        try:
            self.connect()
            self.conn.row_factory = sqlite3.Row
            self.cursor = self.conn.cursor()
            self.cursor.execute(query, parameter)
            result = self.cursor.fetchone()
            if result:
                return dict(result)
            return None
        except sqlite3.Error as error:
            print(f"De database geeft een error: {error}")
            return None
        finally:
            self.database_close()

    def database_close(self):
        """
        Database sluiten.
        """
        self.conn.close()