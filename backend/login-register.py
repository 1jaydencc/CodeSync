from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World! This is your Flask backend.'

if __name__ == '__main__':
    app.run(debug=True)