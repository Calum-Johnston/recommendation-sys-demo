import pandas as pd
import numpy as np
from flask import Flask, render_template, request, json, redirect, url_for

app = Flask(__name__)


###########################################################
# MAIN FUNCTIONS
###########################################################
@app.route("/")
def index():
    return render_template('home.html')   

@app.route('/signInUser', methods=['POST'])
def signInUser():
    user =  request.form['username'];
    password = request.form['password'];
    for indexes, row in users.iterrows():
        if(str(row['user_id']) == str(user) and str(row['user_password']) == str(password)):
            return json.dumps({'status':'OK','user':user,'pass':password});
    return json.dumps({'status':'FAIL','user':user,'pass':password});

@app.route('/signUpUser', methods=['POST'])
def signUpUser():
    user = request.form['username']
    password = request.form['password']
    users.loc[users.shape[0]] = [int(user), password]
    return json.dumps({'status':'OK'})

@app.route('/getNextUserID')
def getNextUserID():
    return str(users.shape[0] + 1)



# Displays user information once logged in
@app.route('/account')
def display_Information():
    return render_template('account.html', data=request.args.get('user_id'))

@app.route('/getUserRatings')
def getUserRatings():
    user = request.args.get('user_id')
    userRatings = ratings[ratings['user_id'] == int(user)]
    del userRatings['user_id']
    userBooks = pd.merge(books, userRatings, on='book_id')
    del userBooks['book_genre']
    userBooks = userBooks.sort_values(by='book_id')
    return userBooks.to_json(orient='records')

@app.route('/deleteuserdata', methods=['POST'])
def deleteUserData():
    user = request.form['user_id']
    book = request.form['book_id']
    global ratings

    if(ratings[(ratings['user_id'] == int(user)) & (ratings['book_id'] == int(book))].shape[0] == 0):
        return json.dumps({'status':'FAIL'})
    
    ratings = ratings[(ratings['user_id'] != int(user)) | (ratings['book_id'] != int(book))]
    return json.dumps({'status':'OK'})

@app.route('/edituserdata', methods=['POST'])
def editUserData():
    user = request.form['user_id']
    book = request.form['book_id']
    rating = request.form['rating']

    if(ratings[(ratings['user_id'] == int(user)) & (ratings['book_id'] == int(book))].shape[0] == 0):
        return json.dumps({'status':'FAIL'})

    ratings.loc[(ratings['user_id'] == int(user)) & (ratings['book_id'] == int(book)), ['rating']] = int(rating)
    return json.dumps({'status':'OK'})


@app.route('/adduserdata', methods=['POST'])
def addUserData():
    user = request.form['user_id']
    book = request.form['book_id']
    rating = request.form['rating']

    if(ratings[(ratings['user_id'] == int(user)) & (ratings['book_id'] == int(book))].shape[0] == 1):
        return json.dumps({'status':'FAIL'})

    ratings.loc[ratings.shape[0]] = [int(user), int(book), int(rating)]
    return json.dumps({'status':'OK'})


###########################################################
# ADDITIONAL FUNCTIONS
###########################################################



###########################################################
# Run application
###########################################################
if __name__ == "__main__":

    # Read in the required data
    books = pd.read_csv("./books-dataset/books.csv")
    ratings = pd.read_csv("./books-dataset/ratings.csv")
    users = pd.read_csv("./books-dataset/users.csv")

    # Run app
    app.run()



