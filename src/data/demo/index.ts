import type { User, Post, Category } from '@/lib/types'

// Demo users data
export const demoUsers: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    created_at: '2024-01-18T16:45:00Z'
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    created_at: '2024-01-19T11:30:00Z'
  }
]

// Demo categories data
export const demoCategories: Category[] = [
  {
    id: 1,
    name: 'Technology',
    description: 'Posts about technology and programming',
    color: '#3B82F6',
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: 2,
    name: 'Design',
    description: 'UI/UX design and visual content',
    color: '#8B5CF6',
    created_at: '2024-01-10T08:30:00Z'
  },
  {
    id: 3,
    name: 'Business',
    description: 'Business strategy and entrepreneurship',
    color: '#10B981',
    created_at: '2024-01-10T09:00:00Z'
  },
  {
    id: 4,
    name: 'Tutorial',
    description: 'Step-by-step guides and tutorials',
    color: '#F59E0B',
    created_at: '2024-01-10T09:30:00Z'
  }
]

// Demo posts data
export const demoPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Next.js',
    content: 'Next.js is a powerful React framework that enables you to build full-stack web applications...',
    author_id: 1,
    published: true,
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 2,
    title: 'Modern CSS Techniques',
    content: 'CSS has evolved significantly over the years. Modern techniques like Grid and Flexbox...',
    author_id: 2,
    published: true,
    created_at: '2024-01-21T14:30:00Z'
  },
  {
    id: 3,
    title: 'Building REST APIs',
    content: 'RESTful APIs are the backbone of modern web applications. In this post, we will explore...',
    author_id: 1,
    published: false,
    created_at: '2024-01-22T09:45:00Z'
  },
  {
    id: 4,
    title: 'TypeScript Best Practices',
    content: 'TypeScript adds static typing to JavaScript, making your code more robust and maintainable...',
    author_id: 3,
    published: true,
    created_at: '2024-01-23T16:20:00Z'
  },
  {
    id: 5,
    title: 'Database Design Patterns',
    content: 'Good database design is crucial for application performance. Let us explore common patterns...',
    author_id: 4,
    published: true,
    created_at: '2024-01-24T11:15:00Z'
  }
]

// In-memory storage with auto-increment IDs
let nextUserId = Math.max(...demoUsers.map(u => u.id)) + 1
let nextPostId = Math.max(...demoPosts.map(p => p.id)) + 1  
let nextCategoryId = Math.max(...demoCategories.map(c => c.id)) + 1

// Clone arrays for manipulation
let users = [...demoUsers]
let posts = [...demoPosts]
let categories = [...demoCategories]

export const demoStore = {
  // Users
  getUsers: () => [...users],
  getUserById: (id: number) => users.find(u => u.id === id),
  createUser: (userData: Omit<User, 'id' | 'created_at'>) => {
    const user: User = {
      ...userData,
      id: nextUserId++,
      created_at: new Date().toISOString()
    }
    users.push(user)
    return user
  },
  updateUser: (id: number, userData: Partial<User>) => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...userData }
    return users[index]
  },
  deleteUser: (id: number) => {
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  },

  // Posts
  getPosts: () => [...posts],
  getPostById: (id: number) => posts.find(p => p.id === id),
  createPost: (postData: Omit<Post, 'id' | 'created_at'>) => {
    const post: Post = {
      ...postData,
      id: nextPostId++,
      created_at: new Date().toISOString()
    }
    posts.push(post)
    return post
  },
  updatePost: (id: number, postData: Partial<Post>) => {
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) return null
    posts[index] = { ...posts[index], ...postData }
    return posts[index]
  },
  deletePost: (id: number) => {
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) return false
    posts.splice(index, 1)
    return true
  },

  // Categories
  getCategories: () => [...categories],
  getCategoryById: (id: number) => categories.find(c => c.id === id),
  createCategory: (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    const category: Category = {
      ...categoryData,
      id: nextCategoryId++,
      created_at: new Date().toISOString()
    }
    categories.push(category)
    return category
  },
  updateCategory: (id: number, categoryData: Partial<Category>) => {
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) return null
    categories[index] = { ...categories[index], ...categoryData }
    return categories[index]
  },
  deleteCategory: (id: number) => {
    const index = categories.findIndex(c => c.id === id)
    if (index === -1) return false
    categories.splice(index, 1)
    return true
  }
}