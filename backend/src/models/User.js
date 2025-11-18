import { executeQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>}
   */
  static async create({ username, email, password, fullName, role = 'user' }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO DC_Users (username, email, password, fullName, role, isActive, createdAt, updatedAt)
        OUTPUT INSERTED.*
        VALUES (@username, @email, @password, @fullName, @role, 1, GETDATE(), GETDATE())
      `;

      const result = await executeQuery(query, {
        username,
        email,
        password: hashedPassword,
        fullName,
        role,
      });

      // Remove password from returned object
      const user = result.recordset[0];
      delete user.password;
      return user;
    } catch (error) {
      if (error.number === 2627) {
        // Unique constraint violation
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  /**
   * Find user by username
   * @param {string} username
   * @returns {Promise<Object|null>}
   */
  static async findByUsername(username) {
    const query = `
      SELECT * FROM DC_Users WHERE username = @username
    `;

    const result = await executeQuery(query, { username });
    return result.recordset[0] || null;
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const query = `
      SELECT * FROM DC_Users WHERE email = @email
    `;

    const result = await executeQuery(query, { email });
    return result.recordset[0] || null;
  }

  /**
   * Find user by ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  static async findById(id) {
    const query = `
      SELECT userId, username, email, fullName, role, isActive, createdAt, updatedAt
      FROM DC_Users
      WHERE userId = @id
    `;

    const result = await executeQuery(query, { id });
    return result.recordset[0] || null;
  }

  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  static async findAll() {
    const query = `
      SELECT userId, username, email, fullName, role, isActive, createdAt, updatedAt
      FROM DC_Users
      ORDER BY createdAt DESC
    `;

    const result = await executeQuery(query);
    return result.recordset;
  }

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Data to update
   * @returns {Promise<Object>}
   */
  static async update(id, { email, fullName, role, isActive }) {
    const query = `
      UPDATE DC_Users
      SET
        email = COALESCE(@email, email),
        fullName = COALESCE(@fullName, fullName),
        role = COALESCE(@role, role),
        isActive = COALESCE(@isActive, isActive),
        updatedAt = GETDATE()
      OUTPUT INSERTED.userId, INSERTED.username, INSERTED.email, INSERTED.fullName, INSERTED.role, INSERTED.isActive
      WHERE userId = @id
    `;

    const result = await executeQuery(query, { id, email, fullName, role, isActive });
    return result.recordset[0];
  }

  /**
   * Update password
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>}
   */
  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = `
      UPDATE DC_Users
      SET password = @password, updatedAt = GETDATE()
      WHERE userId = @id
    `;

    await executeQuery(query, { id, password: hashedPassword });
    return true;
  }

  /**
   * Delete user (soft delete)
   * @param {number} id - User ID
   * @returns {Promise<boolean>}
   */
  static async delete(id) {
    const query = `
      UPDATE DC_Users
      SET isActive = 0, updatedAt = GETDATE()
      WHERE userId = @id
    `;

    await executeQuery(query, { id });
    return true;
  }

  /**
   * Verify password
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
