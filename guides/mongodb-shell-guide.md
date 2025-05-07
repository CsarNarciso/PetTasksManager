# MongoDB service (mongod)
## 🚀 1. Start MongoDB service
```sh
sudo systemctl start mongod
```

## 2. Check MongoDB service status
```sh
sudo systemctl status mongod
```


# MongoDB Shell Guide (mongosh)
This guide helps you practice basic MongoDB operations using the shell (`mongosh`), with short explanations and corresponding commands.

## 🚀 1. Start MongoDB Shell

```sh
mongosh
```

Connects to the local MongoDB server.

---

## 🏠 2. Show All Databases

```js
show dbs
```

Lists all databases on your MongoDB server.

---

## 📁 3. Switch or Create a Database

```js
use dogsdb
```

Switches to `dogsdb`. If it doesn't exist yet, it will be created on first write.

---

## 📂 4. Show All Collections in a DB

```js
show collections
```

Lists all collections in the current database.

---

## 🐶 5. Insert One Document into a Collection

```js
db.breeds.insertOne({
  name: "Labrador Retriever",
  size: "Large",
  life_expectancy: 12
})
```

Inserts a dog breed document into the `breeds` collection.

---

## 🧾 6. Insert Multiple Documents

```js
db.breeds.insertMany([
  { name: "Beagle", size: "Medium", life_expectancy: 15 },
  { name: "Chihuahua", size: "Small", life_expectancy: 16 }
])
```

Adds several documents at once.

---

## 🔍 7. Find All Documents

```js
db.breeds.find()
```

Returns all documents in the `breeds` collection.

---

## 🔎 8. Find with Filter (Query)

```js
db.breeds.find({ size: "Small" })
```

Finds all breeds that are small.

---

## 🛠️ 9. Update One Document

```js
db.breeds.updateOne(
  { name: "Beagle" },
  { $set: { life_expectancy: 14 } }
)
```

Updates the `life_expectancy` of the Beagle.

---

## 🛠️ 10. Update Multiple Documents

```js
db.breeds.updateMany(
  { size: "Large" },
  { $set: { popular: true } }
)
```

Adds a `popular` field to all large breeds.

---

## 🗑️ 11. Delete One Document

```js
db.breeds.deleteOne({ name: "Chihuahua" })
```

Deletes one document matching the condition.

---

## 🗑️ 12. Delete Many Documents

```js
db.breeds.deleteMany({ size: "Small" })
```

Deletes all breeds with `size` of Small.

---

## 🔁 13. Drop a Collection

```js
db.breeds.drop()
```

Deletes the entire `breeds` collection.

---

## 🧼 14. Drop the Current Database

```js
db.dropDatabase()
```

Completely removes the currently selected database.

---

## ✅ 15. Exit MongoDB Shell

```js
exit
```

Exits the `mongosh` shell.

---

Happy hacking with MongoDB! 🐾
