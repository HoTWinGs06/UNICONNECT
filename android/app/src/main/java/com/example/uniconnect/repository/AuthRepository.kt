package com.example.uniconnect.repository

import com.example.uniconnect.Supabase
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class AuthRepository {
    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        // Monitor session changes
        // Supabase.client.auth.sessionStatus... (For a real app, listen to sessionStatus flow)
    }

    suspend fun signInWithEmail(email: String, password: String): Result<Unit> {
        return try {
            Supabase.client.auth.signInWith(Email) {
                this.email = email
                this.password = password
            }
            _authState.value = AuthState.Authenticated
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signUpWithEmail(email: String, password: String): Result<Unit> {
        return try {
            Supabase.client.auth.signUpWith(Email) {
                this.email = email
                this.password = password
            }
            // Supabase may require email confirmation before granting a session.
            // Only transition to Authenticated if a valid session exists.
            val session = Supabase.client.auth.currentSessionOrNull()
            _authState.value = if (session != null) AuthState.Authenticated else AuthState.Unauthenticated
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signOut() {
        Supabase.client.auth.signOut()
        _authState.value = AuthState.Unauthenticated
    }

    fun checkSession() {
        val session = Supabase.client.auth.currentSessionOrNull()
        if (session != null) {
            _authState.value = AuthState.Authenticated
        } else {
            _authState.value = AuthState.Unauthenticated
        }
    }
}

sealed class AuthState {
    object Loading : AuthState()
    object Authenticated : AuthState()
    object Unauthenticated : AuthState()
}
