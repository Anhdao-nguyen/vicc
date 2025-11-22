import { DepartmentApprover } from '../models/DepartmentApprover.js';

/**
 * Get all approvers for a department
 */
export const getApproversByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const activeOnly = req.query.activeOnly === 'true';

    const approvers = await DepartmentApprover.findByDepartment(
      departmentId,
      activeOnly
    );

    res.status(200).json({
      success: true,
      data: approvers,
      count: approvers.length,
    });
  } catch (error) {
    console.error('Error in getApproversByDepartment:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách approvers',
      error: error.message,
    });
  }
};

/**
 * Get single approver by ID
 */
export const getApproverById = async (req, res) => {
  try {
    const { approverId } = req.params;

    const approver = await DepartmentApprover.findById(approverId);

    if (!approver) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy approver',
      });
    }

    res.status(200).json({
      success: true,
      data: approver,
    });
  } catch (error) {
    console.error('Error in getApproverById:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin approver',
      error: error.message,
    });
  }
};

/**
 * Create new approver
 */
export const createApprover = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { email, name, role } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc',
      });
    }

    // Prepare approver data
    const approverData = {
      DepartmentID: departmentId,
      DepartmentName: getDepartmentName(departmentId),
      ApproverEmail: email,
      ApproverName: name || null,
      ApproverRole: role || 'leader',
      IsActive: true,
      CreatedBy: req.user?.userId || null,
    };

    const newApprover = await DepartmentApprover.create(approverData);

    res.status(201).json({
      success: true,
      message: 'Thêm approver thành công',
      data: newApprover,
    });
  } catch (error) {
    console.error('Error in createApprover:', error);

    // Handle specific errors
    if (error.message.includes('@intersnack.com.vn')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes('đã được thêm')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo approver',
      error: error.message,
    });
  }
};

/**
 * Update approver
 */
export const updateApprover = async (req, res) => {
  try {
    const { approverId } = req.params;
    const updateData = {};

    // Only update provided fields
    if (req.body.email !== undefined) {
      updateData.ApproverEmail = req.body.email;
    }
    if (req.body.name !== undefined) {
      updateData.ApproverName = req.body.name;
    }
    if (req.body.role !== undefined) {
      updateData.ApproverRole = req.body.role;
    }
    if (req.body.isActive !== undefined) {
      updateData.IsActive = req.body.isActive;
    }

    const updatedApprover = await DepartmentApprover.update(
      approverId,
      updateData
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật approver thành công',
      data: updatedApprover,
    });
  } catch (error) {
    console.error('Error in updateApprover:', error);

    if (error.message.includes('@intersnack.com.vn')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật approver',
      error: error.message,
    });
  }
};

/**
 * Delete approver
 */
export const deleteApprover = async (req, res) => {
  try {
    const { approverId } = req.params;

    const deleted = await DepartmentApprover.delete(approverId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy approver để xóa',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa approver thành công',
    });
  } catch (error) {
    console.error('Error in deleteApprover:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa approver',
      error: error.message,
    });
  }
};

/**
 * Deactivate approver (soft delete)
 */
export const deactivateApprover = async (req, res) => {
  try {
    const { approverId } = req.params;

    const deactivated = await DepartmentApprover.deactivate(approverId);

    res.status(200).json({
      success: true,
      message: 'Vô hiệu hóa approver thành công',
      data: deactivated,
    });
  } catch (error) {
    console.error('Error in deactivateApprover:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi vô hiệu hóa approver',
      error: error.message,
    });
  }
};

/**
 * Get statistics for all departments
 */
export const getApproverStatistics = async (req, res) => {
  try {
    const statistics = await DepartmentApprover.getStatistics();

    res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    console.error('Error in getApproverStatistics:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thống kê',
      error: error.message,
    });
  }
};

/**
 * Helper function to get department name from ID
 */
function getDepartmentName(departmentId) {
  const departments = {
    qc: 'Quality Control',
    hr: 'Human Resources',
    hse: 'Health, Safety & Environment',
    maintenance: 'Maintenance',
  };
  return departments[departmentId] || departmentId;
}
