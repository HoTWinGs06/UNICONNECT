package com.example.uniconnect.repository

import com.example.uniconnect.Supabase
import com.example.uniconnect.model.Post
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class FeedRepository {
    private val _posts = MutableStateFlow<List<Post>>(emptyList())
    val posts: StateFlow<List<Post>> = _posts.asStateFlow()

    suspend fun fetchPosts(): Result<Unit> {
        return try {
            val result = Supabase.client.from("posts")
                .select()
                .decodeList<Post>()
            _posts.value = result.sortedByDescending { it.createdAt }
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createPost(content: String): Result<Unit> {
        return try {
            val user = Supabase.client.auth.currentSessionOrNull()?.user
                ?: return Result.failure(Exception("Not logged in"))

            Supabase.client.from("posts").insert(
                mapOf(
                    "author_id" to user.id,
                    "content" to content
                )
            )

            fetchPosts()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
