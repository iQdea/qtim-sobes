import { DataSource } from 'typeorm';
import { getDataSourceOptions } from './typeorm.config';

const dataSource = new DataSource(getDataSourceOptions())
export default dataSource;