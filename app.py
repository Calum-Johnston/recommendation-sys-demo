import pandas as pd
import numpy as np
from flask import Flask, render_template, request, json, redirect, url_for
from scipy.sparse.linalg import svds

app = Flask(__name__)


###########################################################
# MAIN FUNCTIONS
###########################################################
@app.route("/")
def index():
    return render_template('home.html')   

@app.route('/signInUser', methods=['POST'])
def signInUser():
    user =  request.form['username']
    password = request.form['password']
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
def account():
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
    print(ratings)
    return json.dumps({'status':'OK'})

@app.route('/recommend', methods=['POST'])
def recommend():
   user = request.form['user_id'] 
   preds_df = getRecommendationsTable(user)
   already_rated, predictions = recommendBooks(preds_df, user, 5)
   return predictions.to_json(orient='records')



@app.route('/books')
def books():
    return render_template('books.html')

@app.route('/getBookData')
def getBookData():
    return books.to_json(orient='records')

@app.route('/deletebookdata', methods=['POST'])
def deleteBookData():
    book = request.form['book_id']
    global books

    if(books[books['book_id'] == int(book)].shape[0] == 0):
        return json.dumps({'status':'FAIL'})
    
    books = books[books['book_id'] != int(book)]
    return json.dumps({'status':'OK'})

@app.route('/editbookdata', methods=['POST'])
def editBookData():
    book = request.form['book_id']
    title = request.form['book_title']
    author = request.form['book_author']
    genre = request.form['book_genre']

    if(books[books['book_id'] == int(book)].shape[0] == 0):
        return json.dumps({'status':'FAIL'})

    if(str(title) != ""):
        books.loc[(books['book_id'] == int(book)), ['book_title']] = title
    if(str(author) != ""):
        books.loc[(books['book_id'] == int(book)), ['book_author']] = author   
    if(str(genre) != ""):
        books.loc[(books['book_id'] == int(book)), ['book_genre']] = genre

    return json.dumps({'status':'OK'})


@app.route('/addbookdata', methods=['POST'])
def addBookData():
    title = request.form['book_title']
    author = request.form['book_author']
    genre = request.form['book_genre']

    if(books[(books['book_title'] == title) & (books['book_author'] == author) & (books['book_genre'] == genre)].shape[0] == 1):
        return json.dumps({'status':'FAIL'})
    print(title, author, genre)
    books.loc[ratings.shape[0]] = [int(books.shape[0] + 1), title, author, genre]
    return json.dumps({'status':'OK'})

###########################################################
# ADDITIONAL FUNCTIONS
###########################################################
# Builds the recommendation table
def getRecommendationsTable(user):
    # Format ratings matrix s.t. one row per user & one column per book
    R_df = ratings.pivot(index = 'user_id', columns ='book_id', values = 'rating').fillna(0)

    # De-mean the data (normalize by each user's mean)
    R = R_df.values
    user_ratings_mean = np.mean(R, axis = 1)
    # Convert dataframe to numpy array
    R_demeaned = R - user_ratings_mean.reshape(-1, 1)

    # Perform matrix factorisation via single value decomposition
    U, sigma, Vt = svds(R_demeaned, k = min(R_demeaned.shape[1] - 1, 50))

    # Convert diagonal values in sigma to matrix form
    sigma = np.diag(sigma)  

    # For each book calculate the estimated rating for each user
    all_user_predicted_ratings = np.dot(np.dot(U, sigma), Vt) + user_ratings_mean.reshape(-1, 1)
    # Convert the numpy array to dataframe
    preds_df = pd.DataFrame(all_user_predicted_ratings, columns = R_df.columns)

    return preds_df
    

# Recommends the user books
def recommendBooks(predictions_df, user, num_recommendations=5):
    # Get and sort the user's predictions
    user_row_number = int(user) - 1 # UserID starts at 1, not 0
    sorted_user_predictions = predictions_df.iloc[user_row_number].sort_values(ascending=False)

    # Get the user's data and merge in the movie information.
    user_data = ratings[ratings.user_id == (int(user))]
    user_full = (user_data.merge(books, how = 'left', left_on = 'book_id', right_on = 'book_id').
                     sort_values(['rating'], ascending=False)
                 )
    
    # Recommend the highest predicted rating movies that the user hasn't seen yet.
    recommendations = (books[~books['book_id'].isin(user_full['book_id'])].
         merge(pd.DataFrame(sorted_user_predictions).reset_index(), how = 'left',
               left_on = 'book_id',
               right_on = 'book_id').
         rename(columns = {user_row_number: 'Predictions'}).
         sort_values('Predictions', ascending = False).
                       iloc[:num_recommendations, :-1]
                      )
    
    return user_full, recommendations






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



