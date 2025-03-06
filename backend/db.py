import sqlite3


#create simple connect for test, after success, change postgres


class DatabaseManager:
    def __init__(self):
        self.conn = sqlite3.connect('database.db', check_same_thread=False)

    def create_table(self):
        with self.conn:
            self.cursor = self.conn.cursor()
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL
                )
            ''')
            self.conn.commit()


    def get_user(self, email):
        with self.conn:
            self.cursor = self.conn.cursor()
            self.cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            return self.cursor.fetchone()
