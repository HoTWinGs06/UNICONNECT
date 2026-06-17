package com.example.uniconnect.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.uniconnect.model.Post
import com.example.uniconnect.repository.FeedRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class FeedViewModel : ViewModel() {
    private val repository = FeedRepository()

    val posts: StateFlow<List<Post>> = repository.posts

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init {
        fetchPosts()
    }

    fun fetchPosts() {
        viewModelScope.launch {
            _isLoading.value = true
            val result = repository.fetchPosts()
            if (result.isFailure) {
                _error.value = result.exceptionOrNull()?.message ?: "Failed to fetch posts"
            }
            _isLoading.value = false
        }
    }

    fun createPost(content: String) {
        if (content.isBlank()) return
        viewModelScope.launch {
            val result = repository.createPost(content)
            if (result.isFailure) {
                _error.value = result.exceptionOrNull()?.message ?: "Failed to create post"
            }
        }
    }
}
