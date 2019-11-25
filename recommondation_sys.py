import pandas as pd
import numpy as np
import os

def readData():
    books_data = pd.read_csv("./books-dataset/books.csv")
    ratings_data = pd.read_csv("./books-dataset/ratings.csv")
    return books_data, ratings_data
    

books, ratings = readData()

R_df = ratings.pivot(index="user_id", columns = "book_id", values = 'rating')
print(R_df.head())


