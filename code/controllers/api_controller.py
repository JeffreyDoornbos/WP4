from fastapi import FastAPI, APIRouter
from models.api_model import Apimodel

api = Apimodel()
app = FastAPI()
router = APIRouter()

class Apicontroller(api.Database):
    def __init__(self):
        super().__init__()
        self.register_routes()

    # Automatisatie
    @router.get("/nickname/", tags=["nickname"])
    def username(self):
        """
        Nickname, dit is extra (hoeft niet).
        """
        return

    @router.get("/highscore_dag/", tags=["highscore_dag"])
    def Highscore_dag(self):
        return

    @router.get("/highscore_week/", tags=["highscore_week"])
    def Highscore_week(self):
        return

    @router.get("/highscore_maand/", tags=["highscore_maand"])
    def Highscore_maand(self):
        return

    @router.get("/highscore_reset/", tags=["highscore_reset"])
    def Highscore_reset(self):
        return

    @router.get("/unmute_auto/", tags=["unmute_auto"])
    def unmute(self):
        """
        Na x aantal dagen unmuten.
        """
        return


    # Handelingen
    @router.get("/mute_by_warning/", tags=["mute_by_warning"])
    def mute_by_warning(self):
        return

    @router.get("/profielfoto/", tags=["profielfoto"])
    def profielfoto(self):
        """
        Nickname, dit is extra (hoeft niet), maar wel mooi om te hebben.
        """
        return

    @router.get("/profiel_wijzigen/", tags=["profiel_wijzigen"])
    def profiel_wijzigen(self):
        return

    """
    Database model (klaar)
    Database lezen (repeat - refresh in de apimodel + js?)
    
    Nieuwe bron (niet beoordeeld = staat 0/ beoordeeld is staat 1)
    Bron wijzigen
    beoordeling
    reactie (feedback)(filteren?)
    punten
    punten krijgen + (nieuwe bron, reactie, beoordeling)
    punten verwijderen + (ban = punten tellen niet!)(verwijder bron, verwijder reactie, verwijder beoordeling)
    Punten onzichtbaar bij mute (feedback onzichtbaar - mute) ban (alle punten onzichtbaar - ban)(admin only)
    Totaal aantal punten
    
    Dashboard (nieuw naar oud, incl check & filters: beoordeeld 0 of 1)
    dashboard studenten/bronnen/reacties > studenten(waarschuwing/muted/ban/wijzigen/verwijderen)
    waarschuwing > 2e = muted/muted/ban
    Automatische mute verwijdering na?
    """