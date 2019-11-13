import pandas as pd
import numpy as np
import os

def readData():
    fields = ['book_id', '']

    books = pd.read_csv("./goodbooks-10k-master/books.csv")
    print(books.head())
    ratings_data = pd.read_csv("./goodbooks-10k-master/ratings.csv")
    print(ratings_data.head())

    # Read and update values using .at
    print(ratings_data.at[4, 'book_id'])
    ratings_data.at[4,'book_id'] = 123
    print(ratings_data.at[4, 'book_id'])
    ratings_data.to_csv("./goodbooks-10k-master/ratings.csv", mode="w", index=False)
    print("Hi")

readData()


