import pandas as pd
import numpy as np
from flask import Flask, render_template, request, json
import os

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')   

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
    user =  request.form['username'];
    password = request.form['password'];
    return json.dumps({'status':'OK','user':user,'pass':password});

if __name__ == "__main__":
    app.run()



# Additional Functions
def readData():
    books_data = pd.read_csv("./books-dataset/books.csv")
    ratings_data = pd.read_csv("./books-dataset/ratings.csv")
    
    books, ratings = readData()
    R_df = ratings.pivot(index="user_id", columns = "book_id", values = 'rating')
    print(R_df.head())

    return books_data, ratings_data
    


