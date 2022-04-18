from unittest import TestCase
from app import app
from boggle import Boggle

boggle = Boggle()

class FlaskTests(TestCase):
    def before(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess["board"] = boggle.make_board()

    def test_home(self):
        with app.test_client() as client:
            res = client.get('/')

            self.assertEqual(res.status_code, 200)

    def test_check_wrong_word(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess["board"] = boggle.make_board()
            res = client.post('/check_word', json = {
                "word" : {"word": "sdsdfdus"}
            })

            self.assertEqual(res.json, {"result": "not-word"})

    def test_check_word(self):
        with app.test_client() as client:
            with client.session_transaction() as sess:
                sess["board"] = [
                    ["w","o","r","d","s"],
                    ["w","o","r","d","s"],
                    ["w","o","r","d","s"],
                    ["w","o","r","d","s"],
                    ["w","o","r","d","s"]
                    ]
            res = client.post('/check_word', json = {
                "word" : {"word": "word"}
            })

            self.assertEqual(res.json, {"result": "not-on-board"})

    def test_highscore(self):
        with app.test_client() as client:
            res = client.post('/highscore', json = {
                "finalScore": {
                    "score": 9,
                    "plays": 3
                }
            })

            self.assertEqual(res.status_code, 200)
