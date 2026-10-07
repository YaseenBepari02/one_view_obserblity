import sys
try:
    import psycopg2
    print("psycopg2 imported successfully")
except ImportError as e:
    print(f"Failed to import psycopg2: {e}")
    sys.exit(1)

try:
    conn = psycopg2.connect(host='localhost', port=5432, dbname='nextgen2', user='postgres', password='admin')
    print("Successfully connected to the database!")
    conn.close()
except Exception as e:
    print(f"Failed to connect: {e}")
