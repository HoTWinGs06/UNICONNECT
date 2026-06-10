package com.example.uniconnect.ui.messages

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class Conversation(
    val id: String,
    val name: String,
    val initials: String,
    val lastMessage: String,
    val time: String,
    val unread: Int = 0,
    val isOnline: Boolean = false,
    val isGroup: Boolean = false,
)

@Composable
fun MessagesScreen(modifier: Modifier = Modifier) {
    var selectedConv by remember { mutableStateOf("sarah") }

    val conversations = remember {
        listOf(
            Conversation("sarah", "Prof. Sarah Jenkins", "SJ", "Sure, let me send you the updated syllabus...", "2:45 PM", isOnline = true),
            Conversation("david", "David Chen", "DC", "Hey! Are you joining the hackathon team?", "1:20 PM", unread = 2, isOnline = true),
            Conversation("algo", "Algo Study Group", "📚", "Carlos: Let's meet at the library today...", "11:00 AM", isGroup = true),
            Conversation("priya", "Priya Malhotra", "PM", "Thanks for the notes! Really helpful 📝", "Yesterday"),
        )
    }

    Row(modifier = modifier.fillMaxSize()) {
        // Conversation list
        Column(
            modifier = Modifier
                .width(320.dp)
                .fillMaxHeight()
                .background(MaterialTheme.colorScheme.surface),
        ) {
            // Header
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("Messages", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.SemiBold)
                    FilledIconButton(
                        onClick = {},
                        modifier = Modifier.size(36.dp),
                        colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.surfaceContainer),
                    ) {
                        Icon(Icons.Default.EditNote, contentDescription = "New message", modifier = Modifier.size(20.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
                Spacer(Modifier.height(12.dp))
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Search conversations...", style = MaterialTheme.typography.bodySmall) },
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true,
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(18.dp)) },
                )
            }

            // Filter chips
            Row(modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                listOf("All", "Unread", "Groups").forEachIndexed { i, label ->
                    FilterChip(
                        selected = i == 0,
                        onClick = {},
                        label = { Text(label, style = MaterialTheme.typography.labelSmall) },
                    )
                }
            }

            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)

            // List
            LazyColumn(modifier = Modifier.weight(1f)) {
                items(conversations) { conv ->
                    ConversationItem(
                        conversation = conv,
                        selected = conv.id == selectedConv,
                        onClick = { selectedConv = conv.id },
                    )
                }
            }
        }

        // Divider
        VerticalDivider(modifier = Modifier.fillMaxHeight(), color = MaterialTheme.colorScheme.outlineVariant)

        // Chat view
        ChatView(
            contact = conversations.first { it.id == selectedConv },
            modifier = Modifier.weight(1f),
        )
    }
}

@Composable
private fun ConversationItem(
    conversation: Conversation,
    selected: Boolean,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier.fillMaxWidth(),
        color = if (selected) MaterialTheme.colorScheme.surfaceContainerLow else Color.Transparent,
        onClick = onClick,
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            // Left selection indicator
            if (selected) {
                Box(
                    modifier = Modifier
                        .width(3.dp)
                        .height(48.dp)
                        .clip(RoundedCornerShape(1.5.dp))
                        .background(Color(0xFF0058BC))
                )
                Spacer(Modifier.width(8.dp))
            }
            // Avatar
            Box(modifier = Modifier.size(48.dp)) {
                if (conversation.isGroup) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        shape = CircleShape,
                        color = MaterialTheme.colorScheme.surfaceVariant,
                    ) {
                        Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                            Icon(Icons.Default.Groups, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.secondaryContainer),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(conversation.initials, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSecondaryContainer)
                    }
                    if (conversation.isOnline) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF22C55E))
                                .align(Alignment.BottomEnd),
                        )
                    }
                }
            }
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text(
                        conversation.name,
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = if (conversation.unread > 0) FontWeight.Bold else FontWeight.Normal,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                        modifier = Modifier.weight(1f),
                    )
                    Text(
                        conversation.time,
                        style = MaterialTheme.typography.labelSmall,
                        color = if (conversation.unread > 0) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.outline,
                    )
                }
                Text(
                    conversation.lastMessage,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (conversation.unread > 0) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant,
                    fontWeight = if (conversation.unread > 0) FontWeight.SemiBold else FontWeight.Normal,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            if (conversation.unread > 0) {
                Spacer(Modifier.width(8.dp))
                Surface(
                    shape = CircleShape,
                    color = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(20.dp),
                ) {
                    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                        Text(conversation.unread.toString(), fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSecondary)
                    }
                }
            }
        }
    }
}

@Composable
private fun ChatView(contact: Conversation, modifier: Modifier = Modifier) {
    Column(modifier = modifier.fillMaxHeight().background(MaterialTheme.colorScheme.background)) {
        // Chat header
        Surface(
            modifier = Modifier.fillMaxWidth().height(56.dp),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 1.dp,
        ) {
            Row(
                modifier = Modifier.fillMaxSize().padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(modifier = Modifier.size(36.dp)) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.secondaryContainer),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text(contact.initials, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSecondaryContainer)
                    }
                    if (contact.isOnline) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF22C55E))
                                .align(Alignment.BottomEnd),
                        )
                    }
                }
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(contact.name, style = MaterialTheme.typography.labelMedium)
                    if (contact.isOnline) {
                        Text("Online", style = MaterialTheme.typography.labelSmall, color = Color(0xFF16A34A), fontSize = 11.sp)
                    }
                }
                Spacer(Modifier.weight(1f))
                IconButton(onClick = {}) { Icon(Icons.Default.Videocam, contentDescription = "Video", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = {}) { Icon(Icons.Default.Call, contentDescription = "Call", modifier = Modifier.size(20.dp)) }
                IconButton(onClick = {}) { Icon(Icons.Default.MoreVert, contentDescription = "More", modifier = Modifier.size(20.dp)) }
            }
        }

        // Messages
        LazyColumn(
            modifier = Modifier.weight(1f).padding(24.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            // Date divider
            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 8.dp)) {
                    HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant)
                    Text("  Today  ", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                    HorizontalDivider(modifier = Modifier.weight(1f), color = MaterialTheme.colorScheme.outlineVariant)
                }
            }
            // Received
            item {
                MessageBubble(
                    text = "Hi Alex! I wanted to follow up on your research proposal. I think the scope is excellent, but we might need to narrow down the methodology section.",
                    time = "2:30 PM",
                    isSent = false,
                    initials = contact.initials,
                )
            }
            // Sent
            item {
                MessageBubble(
                    text = "Absolutely, Professor! I'll revise the methodology to focus specifically on the qualitative analysis portion. Could you send me the updated syllabus for reference?",
                    time = "2:42 PM",
                    isSent = true,
                )
            }
            // Received
            item {
                MessageBubble(
                    text = "Sure, let me send you the updated syllabus with the revised timeline. Give me a moment! 📄",
                    time = "2:45 PM",
                    isSent = false,
                    initials = contact.initials,
                )
            }
        }

        // Input
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 2.dp,
        ) {
            Row(
                modifier = Modifier.padding(12.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.AddCircle, contentDescription = "Add", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                Surface(
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(16.dp),
                    color = MaterialTheme.colorScheme.surfaceContainerLow,
                ) {
                    TextField(
                        value = "",
                        onValueChange = {},
                        placeholder = { Text("Type a message...", style = MaterialTheme.typography.bodyMedium) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = TextFieldDefaults.colors(
                            unfocusedContainerColor = Color.Transparent,
                            focusedContainerColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent,
                            focusedIndicatorColor = Color.Transparent,
                        ),
                        singleLine = true,
                    )
                }
                Spacer(Modifier.width(8.dp))
                IconButton(onClick = {}, modifier = Modifier.size(36.dp)) {
                    Icon(Icons.Default.Mic, contentDescription = "Voice", tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(20.dp))
                }
                FilledIconButton(
                    onClick = {},
                    modifier = Modifier.size(36.dp),
                    colors = IconButtonDefaults.filledIconButtonColors(containerColor = MaterialTheme.colorScheme.secondary),
                ) {
                    Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send", modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
private fun MessageBubble(text: String, time: String, isSent: Boolean, initials: String = "") {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = if (isSent) Arrangement.End else Arrangement.Start,
    ) {
        if (!isSent) {
            Box(
                modifier = Modifier
                    .size(32.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center,
            ) {
                Text(initials, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(Modifier.width(8.dp))
        }
        Column(
            horizontalAlignment = if (isSent) Alignment.End else Alignment.Start,
            modifier = Modifier.widthIn(max = 280.dp),
        ) {
            Surface(
                shape = RoundedCornerShape(
                    topStart = 16.dp, topEnd = 16.dp,
                    bottomStart = if (isSent) 16.dp else 4.dp,
                    bottomEnd = if (isSent) 4.dp else 16.dp,
                ),
                color = if (isSent) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceContainer,
            ) {
                Text(
                    text,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    style = MaterialTheme.typography.bodyMedium,
                    color = if (isSent) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurface,
                )
            }
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(time, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                if (isSent) {
                    Spacer(Modifier.width(4.dp))
                    Icon(Icons.Default.DoneAll, contentDescription = "Read", modifier = Modifier.size(14.dp), tint = MaterialTheme.colorScheme.secondary)
                }
            }
        }
    }
}
