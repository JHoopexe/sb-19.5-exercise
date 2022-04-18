from boggle import Boggle
from flask import Flask, render_template, request, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "bunnyrabbit"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle = Boggle()

@app.route("/")
def home():
    letters = boggle.make_board()
    session['board'] = letters
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)

    return render_template("base.html", letters=letters, highscore=highscore, plays=plays)

@app.route("/check_word", methods=["POST"])
def check_word():
    word = request.json["word"]
    return jsonify({"result": boggle.check_valid_word(session["board"], word["word"])})

@app.route("/highscore", methods=["POST"])
def highscore():
    highscore = request.json["finalScore"]
    session["highscore"] = highscore.get("score")
    session["plays"] = highscore.get("plays")

    return jsonify({"highscore": highscore})
