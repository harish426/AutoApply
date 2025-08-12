from pymongo import MongoClient

def get_document_from_mongodb(uri, db_name, collection_name, query):
    """
    Connects to MongoDB and retrieves a document based on the provided query.

    Args:
        uri (str): MongoDB connection URI.
        db_name (str): Name of the database.
        collection_name (str): Name of the collection.
        query (dict): Query to filter documents.

    Returns:
        dict or None: The first matching document, or None if not found.
    """
    client = MongoClient(uri)
    db = client[db_name]
    collection = db[collection_name]
    document = collection.find_one(query)
    client.close()
    return document

# Example usage:
# uri = "mongodb://localhost:27017/"
# db_name = "testdb"
# collection_name = "testcollection"
# query = {"name": "John"}
# doc = get_document_from_mongodb(uri, db_name, collection_name, query)
# print(doc)