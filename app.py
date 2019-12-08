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

# Displays user information once logged in
@app.route('/account')
def display_Information():
    userRating = getUserRatings(request.args.get('user_id'))
    return render_template('account.html', data=request.args.get('user_id'), table=userRating.to_html())

def getUserRatings(user):
    data = []
    for indexs, row in ratings.iterrows():
        if(str(row['user_id']) == str(user)):
            data.append([row['book_id'], row['rating']])
    df = pd.DataFrame(data, columns = ['Book ID', 'Rating'])
    return dfd



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
    print(users)

    # Run app
    app.run()



