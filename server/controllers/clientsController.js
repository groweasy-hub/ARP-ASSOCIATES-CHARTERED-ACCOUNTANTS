const Client = require("../models/Client");
const { writeAudit } = require("../utils/audit");

const serialize = (client) => ({
  id: client._id,
  name: client.name,
  companyName: client.companyName,
  clientType: client.clientType,
  contactPerson: client.contactPerson,
  email: client.email,
  phone: client.phone,
  pan: client.pan,
  gstin: client.gstin,
  address: client.address,
  service: client.service,
  status: client.status,
  notes: client.notes,
  createdAt: client.createdAt,
  updatedAt: client.updatedAt,
});

exports.listClients = async (req, res, next) => {
  try {
    const { search = "", status = "", page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { name: regex },
        { companyName: regex },
        { contactPerson: regex },
        { email: regex },
        { phone: regex },
        { pan: regex },
        { gstin: regex },
        { service: regex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [clients, total] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Client.countDocuments(filter),
    ]);

    res.json({
      success: true,
      clients: clients.map(serialize),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

exports.createClient = async (req, res, next) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: "Client name is required" });
    }

    const client = await Client.create({ ...req.body, createdBy: req.admin._id });
    await writeAudit(req, "CLIENT_CREATED", "CLIENTS", `${req.admin.email} created client ${client.name}`);
    res.status(201).json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.updateClient = async (req, res, next) => {
  try {
    const protectedFields = ["_id", "id", "createdBy", "createdAt", "updatedAt"];
    protectedFields.forEach((field) => delete req.body[field]);

    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    await writeAudit(req, "CLIENT_UPDATED", "CLIENTS", `${req.admin.email} updated client ${client.name}`);
    res.json({ success: true, client: serialize(client) });
  } catch (err) {
    next(err);
  }
};

exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    await writeAudit(req, "CLIENT_DELETED", "CLIENTS", `${req.admin.email} deleted client ${client.name}`);
    res.json({ success: true, message: "Client deleted" });
  } catch (err) {
    next(err);
  }
};
