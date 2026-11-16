
const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  // Lọc dữ liệu liên hệ
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    Object.keys(contact).forEach((key) => {
      if (contact[key] === undefined) {
        delete contact[key];
      }
    });

    return contact;
  }

  // Thêm liên hệ
  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.insertOne(contact);

    return {
      _id: result.insertedId,
      ...contact,
    };
  }

  // Lấy tất cả liên hệ
  async findAll() {
    return await this.Contact.find({}).toArray();
  }

  // Tìm liên hệ theo tên
  async findByName(name) {
    return await this.Contact.find({
      name: { $regex: name, $options: "i" },
    }).toArray();
  }

  // Tìm liên hệ theo ID
  async findById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await this.Contact.findOne({
      _id: new ObjectId(id),
    });
  }

  // Cập nhật liên hệ
  async update(id, payload) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const contact = this.extractContactData(payload);

    const result = await this.Contact.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: contact },
      { returnDocument: "after" }
    );

    return result;
  }

  // Xóa liên hệ
  async delete(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await this.Contact.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }

  // Lấy liên hệ yêu thích
  async findFavorite() {
    return await this.Contact.find({
      favorite: true,
    }).toArray();
  }

  // Xóa tất cả liên hệ
  async deleteAll() {
    return await this.Contact.deleteMany({});
  }
}

module.exports = ContactService;
