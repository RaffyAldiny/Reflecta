# Allow Django's MySQL backend to work with PyMySQL on Windows (no compiler needed)
import pymysql
pymysql.install_as_MySQLdb()
