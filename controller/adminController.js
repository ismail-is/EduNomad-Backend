const AdminController = require("../model/Admin"); // adjust path

// Insert new (default: pending)
const createAdminStatus = async (req, res) => {
  try {
    const { status, updatedBy, remarks } = req.body;

    const adminRecord = new AdminController({
      status: status || "pending", // default if not provided
      updatedBy,
      remarks,
    });

    await adminRecord.save();

    res.status(201).json({
      success: true,
      message: "Admin status created successfully",
      data: adminRecord,
    });
  } catch (error) {
    console.error("Error creating admin status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update accept/reject
const updateAdminStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updatedBy, remarks } = req.body;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const updatedRecord = await AdminController.findByIdAndUpdate(
      id,
      { status, updatedBy, remarks },
      { new: true } // return updated doc
    );

    if (!updatedRecord) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    res.json({
      success: true,
      message: "Admin status updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating admin status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const viewAdminStatus = async (req, res) => {
  try {
    // Only show jobs for the authenticated user
    const data = await AdminController.find();
    res.send({ 'Admin controller': true, data });
  } catch (error) {
    console.log("Admin controller", error);
    res.status(500).json({ success: false, message: "Data fetching Error" });
  }
};

module.exports = {
  createAdminStatus,
  updateAdminStatus,
  viewAdminStatus
};
