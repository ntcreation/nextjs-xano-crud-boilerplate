// Base types for all entities
export interface BaseEntity {
  id: string // UUID format in Xano
  created_at: number // Timestamp in Xano
}

// User entity
export interface User extends BaseEntity {
  name: string
  email: string
}

export interface CreateUserInput {
  name: string
  email: string
}

export interface UpdateUserInput extends CreateUserInput {
  id: number
}

// Post entity (matches Xano structure)
export interface Post extends BaseEntity {
  title: string
  content: string
  user_id: string // UUID in Xano
  published: boolean
}

export interface CreatePostInput {
  title: string
  content: string
  user_id: string
  published?: boolean
}

export interface UpdatePostInput extends CreatePostInput {
  id: string
}

// Category entity
export interface Category extends BaseEntity {
  name: string
  description: string
  color: string
}

export interface CreateCategoryInput {
  name: string
  description: string
  color?: string
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: string
}

// Generic CRUD types (matching Xano endpoints)
export type EntityType = 'post' | 'category'

export interface CRUDResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ListResponse<T> {
  data: T[]
  total: number
  success: boolean
  message?: string
}

// API Error type
export interface APIError {
  message: string
  code: string
  status: number
}