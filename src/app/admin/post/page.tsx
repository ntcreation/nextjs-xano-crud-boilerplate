'use client'

import { useEffect, useState } from 'react'
import type { Post, CreatePostInput } from '@/lib/types'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState<CreatePostInput>({
    title: '',
    content: '',
    user_id: '61becf3a-7e9d-45e8-b8e0-6c83f310ebcd', // Default to existing category ID
    published: false
  })

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      const response = await fetch('/api/post')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Posts</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  async function handleSave() {
    try {
      console.log('Saving post with data:', formData)
      
      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/post/${editingPost.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const responseData = await response.json()
        console.log('Update response:', responseData)
        if (!response.ok) throw new Error(`Failed to update: ${responseData.error || response.statusText}`)
      } else {
        // Create new post
        const response = await fetch('/api/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const responseData = await response.json()
        console.log('Create response:', responseData)
        if (!response.ok) throw new Error(`Failed to create: ${responseData.error || response.statusText}`)
      }
      
      // Refresh data and close form
      await loadPosts()
      setShowForm(false)
      setEditingPost(null)
      setFormData({ title: '', content: '', user_id: '61becf3a-7e9d-45e8-b8e0-6c83f310ebcd', published: false })
    } catch (error) {
      console.error('Error saving post:', error)
      alert(`Failed to save post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  function handleEdit(post: Post) {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      published: post.published
    })
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const response = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete')
      }
      
      if (data.success) {
        await loadPosts()
      } else {
        alert('Delete failed - item may not exist')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete post: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Post
        </button>
      </div>

      {showForm && (
        <PostForm 
          post={editingPost}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingPost(null)
            setFormData({ title: '', content: '', user_id: '61becf3a-7e9d-45e8-b8e0-6c83f310ebcd', published: false })
          }}
        />
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {post.content}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PostForm({ 
  post, 
  formData, 
  setFormData, 
  onSave, 
  onCancel 
}: {
  post: Post | null
  formData: CreatePostInput
  setFormData: (data: CreatePostInput) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {post ? 'Edit Post' : 'Create New Post'}
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <input
            type="text"
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="UUID of the user"
          />
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
        
        <div className="flex gap-2 pt-4">
          <button
            onClick={onSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {post ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}