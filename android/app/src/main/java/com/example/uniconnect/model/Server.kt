package com.example.uniconnect.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Server(
    val id: String,
    val name: String,
    val description: String? = null,
    @SerialName("icon_url") val iconUrl: String? = null
)
