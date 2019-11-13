import pandas as pd
import numpy as np
import os

def readData():
    fields = ['book_id', '']

    books = pd.read_csv("./books-dataset/books.csv")
    print(books.head())
    ratings_data = pd.read_csv("./books-dataset/ratings.csv")
    print(ratings_data.head())

readData()


