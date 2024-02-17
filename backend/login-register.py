from website import create_app

app = create_app

def hello():
    return 'Hello, World! This is your Flask backend.'

if __name__ == '__main__':
    app.run(debug=True)