import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import { CreateSupplierDto } from './dto/create-supplier.dto';

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_op8wGr2qmMZc@ep-billowing-mud-aos2j9zs.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false },
});

@Injectable()
export class SuppliersService implements OnModuleInit {
  async onModuleInit() {
    await this.createTable();
    console.log('✅ PostgreSQL Connected Successfully!');
  }

  private async createTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        medicine_name VARCHAR(100) NOT NULL,
        supply_date DATE NOT NULL,
        quantity INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
  }

  async findAll() {
    const result = await pool.query('SELECT * FROM suppliers ORDER BY id DESC');
    return result.rows;
  }

  async findOne(id: number) {
    const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [id]);
    return result.rows[0];
  }

  async create(dto: CreateSupplierDto) {
    const { name, contact, email, medicine_name, supply_date, quantity } = dto;
    const result = await pool.query(
      `INSERT INTO suppliers (name, contact, email, medicine_name, supply_date, quantity)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, contact, email, medicine_name, supply_date, quantity],
    );
    return result.rows[0];
  }

  async update(id: number, dto: CreateSupplierDto) {
    const { name, contact, email, medicine_name, supply_date, quantity } = dto;
    const result = await pool.query(
      `UPDATE suppliers SET name=$1, contact=$2, email=$3,
       medicine_name=$4, supply_date=$5, quantity=$6
       WHERE id=$7 RETURNING *`,
      [name, contact, email, medicine_name, supply_date, quantity, id],
    );
    return result.rows[0];
  }

  async remove(id: number) {
    const result = await pool.query(
      'DELETE FROM suppliers WHERE id = $1 RETURNING *',
      [id],
    );
    return result.rows[0];
  }
}