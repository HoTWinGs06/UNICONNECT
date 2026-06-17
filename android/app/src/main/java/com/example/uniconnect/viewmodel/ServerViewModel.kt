package com.example.uniconnect.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.uniconnect.model.Server
import com.example.uniconnect.repository.ServerRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class ServerViewModel : ViewModel() {
    private val repository = ServerRepository()

    val servers: StateFlow<List<Server>> = repository.servers

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    init {
        fetchServers()
    }

    fun fetchServers() {
        viewModelScope.launch {
            _isLoading.value = true
            val result = repository.fetchServers()
            if (result.isFailure) {
                _error.value = result.exceptionOrNull()?.message ?: "Failed to fetch servers"
            }
            _isLoading.value = false
        }
    }
}
