import { config } from '@/lib/config'
import { XanoClient } from './xano-client'
import { demoStore } from '@/data/demo'
import type { User, Post, Category, EntityType } from '@/lib/types'

type EntityMap = {
  post: Post  
  category: Category
}

export class CRUDService {
  private xanoClient?: XanoClient

  constructor() {
    if (config.dataMode === 'xano') {
      this.xanoClient = new XanoClient()
    }
  }

  // Generic methods that work with both demo and Xano data
  async getAll<T extends EntityType>(table: T): Promise<EntityMap[T][]> {
    if (config.dataMode === 'demo') {
      return this.getDemoData(table)
    }
    
    if (!this.xanoClient) throw new Error('Xano client not initialized')
    return this.xanoClient.getAll<EntityMap[T]>(table)
  }

  async getById<T extends EntityType>(table: T, id: string): Promise<EntityMap[T] | null> {
    if (config.dataMode === 'demo') {
      return this.getDemoById(table, id)
    }

    if (!this.xanoClient) throw new Error('Xano client not initialized')
    try {
      return await this.xanoClient.getById<EntityMap[T]>(table, id)
    } catch (error: any) {
      if (error.status === 404) return null
      throw error
    }
  }

  async create<T extends EntityType>(
    table: T, 
    data: Omit<EntityMap[T], 'id' | 'created_at'>
  ): Promise<EntityMap[T]> {
    if (config.dataMode === 'demo') {
      return this.createDemo(table, data)
    }

    if (!this.xanoClient) throw new Error('Xano client not initialized')
    return this.xanoClient.create<EntityMap[T]>(table, data)
  }

  async update<T extends EntityType>(
    table: T, 
    id: string, 
    data: Partial<EntityMap[T]>
  ): Promise<EntityMap[T] | null> {
    if (config.dataMode === 'demo') {
      return this.updateDemo(table, id, data)
    }

    if (!this.xanoClient) throw new Error('Xano client not initialized')
    try {
      return await this.xanoClient.update<EntityMap[T]>(table, id, data)
    } catch (error: any) {
      if (error.status === 404) return null
      throw error
    }
  }

  async delete(table: EntityType, id: string): Promise<boolean> {
    if (config.dataMode === 'demo') {
      return this.deleteDemo(table, id)
    }

    if (!this.xanoClient) throw new Error('Xano client not initialized')
    return this.xanoClient.delete(table, id)
  }

  // Demo data handlers
  private getDemoData<T extends EntityType>(table: T): EntityMap[T][] {
    switch (table) {
      case 'post':
        return demoStore.getPosts() as EntityMap[T][]
      case 'category':
        return demoStore.getCategories() as EntityMap[T][]
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  private getDemoById<T extends EntityType>(table: T, id: string): EntityMap[T] | null {
    const numId = parseInt(id) // Convert string ID to number for demo
    switch (table) {
      case 'post':
        return (demoStore.getPostById(numId) as EntityMap[T]) || null
      case 'category':
        return (demoStore.getCategoryById(numId) as EntityMap[T]) || null
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  private createDemo<T extends EntityType>(
    table: T, 
    data: Omit<EntityMap[T], 'id' | 'created_at'>
  ): EntityMap[T] {
    switch (table) {
      case 'post':
        return demoStore.createPost(data as any) as EntityMap[T]
      case 'category':
        return demoStore.createCategory(data as any) as EntityMap[T]
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  private updateDemo<T extends EntityType>(
    table: T, 
    id: string, 
    data: Partial<EntityMap[T]>
  ): EntityMap[T] | null {
    const numId = parseInt(id) // Convert string ID to number for demo
    switch (table) {
      case 'post':
        return (demoStore.updatePost(numId, data as any) as EntityMap[T]) || null
      case 'category':
        return (demoStore.updateCategory(numId, data as any) as EntityMap[T]) || null
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  private deleteDemo(table: EntityType, id: string): boolean {
    const numId = parseInt(id) // Convert string ID to number for demo
    switch (table) {
      case 'post':
        return demoStore.deletePost(numId)
      case 'category':
        return demoStore.deleteCategory(numId)
      default:
        throw new Error(`Unknown table: ${table}`)
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string, mode: string }> {
    if (config.dataMode === 'demo') {
      return { status: 'connected', mode: 'demo' }
    }

    if (!this.xanoClient) throw new Error('Xano client not initialized')
    const xanoHealth = await this.xanoClient.healthCheck()
    return { status: xanoHealth.status, mode: 'xano' }
  }
}

// Export singleton instance
export const crudService = new CRUDService()