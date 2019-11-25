import pandas as pd
import numpy as np
from flask import Flask
import os

app = Flask(__name__)

@app.route("/output")
def output():
    return "Hello World"

if __name__ == "__main__":
    app.run()



def readData():
    books_data = pd.read_csv("./books-dataset/books.csv")
    ratings_data = pd.read_csv("./books-dataset/ratings.csv")
    
    books, ratings = readData()
    R_df = ratings.pivot(index="user_id", columns = "book_id", values = 'rating')
    print(R_df.head())

    return books_data, ratings_data
    


