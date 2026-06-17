package com.example.uniconnect.repository

import com.example.uniconnect.Supabase
import com.example.uniconnect.model.Server
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class ServerRepository {
    private val _servers = MutableStateFlow<List<Server>>(emptyList())
    val servers: StateFlow<List<Server>> = _servers.asStateFlow()

    suspend fun fetchServers(): Result<Unit> {
        return try {
            val result = Supabase.client.from("servers")
                .select()
                .decodeList<Server>()
            _servers.value = result
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
