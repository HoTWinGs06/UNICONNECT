package com.example.uniconnect.ui.groups

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun GroupsScreen(modifier: Modifier = Modifier) {
    var selectedFilter by remember { mutableStateOf("All Groups") }

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column {
                Text("Study Groups", style = MaterialTheme.typography.headlineLarge)
                Text("Find study partners or create your own group", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        Button(
            onClick = {},
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary),
        ) {
            Icon(Icons.Default.Add, contentDescription = null, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(8.dp))
            Text("Create Study Group", style = MaterialTheme.typography.labelMedium)
        }

        // Filter chips
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("All Groups", "Computer Science", "Engineering", "Business", "Sciences").forEach { filter ->
                FilterChip(
                    selected = selectedFilter == filter,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter, style = MaterialTheme.typography.labelMedium) },
                )
            }
        }

        // Group cards
        GroupCard(
            icon = "💻",
            title = "Algorithms Study Circle",
            description = "Weekly problem-solving sessions focusing on dynamic programming and graph algorithms for CS301.",
            members = 5,
            schedule = "Wed & Fri, 3–5 PM",
            isActive = true,
            gradientColors = listOf(MaterialTheme.colorScheme.secondary, MaterialTheme.colorScheme.primaryContainer),
            buttonLabel = "Request to Join",
            isPrimary = false,
        )

        GroupCard(
            icon = "🔬",
            title = "Organic Chemistry Lab Prep",
            description = "Pre-lab review sessions to discuss procedures, safety, and expected results before weekly labs.",
            members = 2,
            schedule = "Mon, 1–2 PM",
            isActive = false,
            statusLabel = "Starts Mon",
            gradientColors = listOf(MaterialTheme.colorScheme.primaryContainer, MaterialTheme.colorScheme.tertiary),
            buttonLabel = "Join Group",
            isPrimary = true,
        )

        GroupCard(
            icon = "📐",
            title = "Calculus III Workshop",
            description = "Collaborative problem sets and exam prep for multivariable calculus. All skill levels welcome!",
            members = 7,
            schedule = "Tue & Thu, 6–8 PM",
            isActive = true,
            gradientColors = listOf(MaterialTheme.colorScheme.tertiary, MaterialTheme.colorScheme.secondary),
            buttonLabel = "Request to Join",
            isPrimary = false,
        )

        Spacer(Modifier.height(80.dp))
    }
}

@Composable
private fun GroupCard(
    icon: String,
    title: String,
    description: String,
    members: Int,
    schedule: String,
    isActive: Boolean,
    statusLabel: String = if (isActive) "Active Now" else "",
    gradientColors: List<Color>,
    buttonLabel: String,
    isPrimary: Boolean,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        // Gradient top bar
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(8.dp)
                .background(Brush.horizontalGradient(gradientColors))
        )

        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top,
            ) {
                Surface(
                    modifier = Modifier.size(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                ) {
                    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                        Text(icon, fontSize = 24.sp)
                    }
                }
                if (statusLabel.isNotEmpty()) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (isActive) Color(0xFFDCFCE7) else MaterialTheme.colorScheme.surfaceContainer,
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                        ) {
                            if (isActive) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .clip(CircleShape)
                                        .background(Color(0xFF22C55E)),
                                )
                            }
                            Text(
                                statusLabel,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = if (isActive) Color(0xFF15803D) else MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                    }
                }
            }

            Spacer(Modifier.height(12.dp))
            Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(4.dp))
            Text(
                description,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )

            Spacer(Modifier.height(12.dp))

            // Members
            Row(verticalAlignment = Alignment.CenterVertically) {
                Row(horizontalArrangement = Arrangement.spacedBy((-8).dp)) {
                    repeat(minOf(3, members)) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.secondaryContainer),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text("👤", fontSize = 14.sp)
                        }
                    }
                    if (members > 3) {
                        Surface(
                            modifier = Modifier.size(28.dp),
                            shape = CircleShape,
                            color = MaterialTheme.colorScheme.surfaceVariant,
                        ) {
                            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                                Text("+${members - 3}", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                        }
                    }
                }
                Spacer(Modifier.width(8.dp))
                Text("$members members", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            Spacer(Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Schedule, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.width(8.dp))
                Text(schedule, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            Spacer(Modifier.height(16.dp))
            Button(
                onClick = {},
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isPrimary) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.surfaceContainer,
                    contentColor = if (isPrimary) MaterialTheme.colorScheme.onSecondary else MaterialTheme.colorScheme.onSurface,
                ),
            ) {
                Text(buttonLabel, style = MaterialTheme.typography.labelMedium)
            }
        }
    }
}
