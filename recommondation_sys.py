import pandas as pd
import numpy as np
import os

books = pd.read_csv("./goodbooks-10k-master/books.csv")
ratings_data = pd.read_csv("./goodbooks-10k-master/ratings.csv")
print(ratings_data.head())
print(books.head())

