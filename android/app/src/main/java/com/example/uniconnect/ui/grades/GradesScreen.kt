package com.example.uniconnect.ui.grades

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun GradesScreen(modifier: Modifier = Modifier) {
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
                Text("Academic Overview", style = MaterialTheme.typography.headlineLarge)
                Text("Spring 2024 Semester • Junior Year", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }

        // KPI Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            KpiCard(
                icon = Icons.Default.School,
                iconTint = MaterialTheme.colorScheme.secondary,
                value = "3.72",
                label = "Current GPA",
                badge = "↑ 0.15",
                modifier = Modifier.weight(1f),
            )
            KpiCard(
                icon = Icons.Default.BarChart,
                iconTint = MaterialTheme.colorScheme.primaryContainer,
                value = "96",
                label = "Credits Earned",
                modifier = Modifier.weight(1f),
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            KpiCard(
                icon = Icons.AutoMirrored.Filled.MenuBook,
                iconTint = MaterialTheme.colorScheme.tertiary,
                value = "5",
                label = "Active Courses",
                modifier = Modifier.weight(1f),
            )
            KpiCard(
                icon = Icons.Default.EmojiEvents,
                iconTint = MaterialTheme.colorScheme.secondary,
                value = "75%",
                label = "Degree Progress",
                modifier = Modifier.weight(1f),
            )
        }

        // Course Grades
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("Course Grades", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
                    TextButton(onClick = {}) {
                        Text("View All", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.secondary)
                    }
                }
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                CourseGradeItem("CS 301 — Data Structures & Algorithms", "Prof. Kim • 4 Credits", "A", "93.2%", Icons.Default.Computer, MaterialTheme.colorScheme.secondary)
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(horizontal = 16.dp))
                CourseGradeItem("MATH 302 — Calculus III", "Prof. Rivera • 4 Credits", "A-", "90.8%", Icons.Default.Calculate, MaterialTheme.colorScheme.primaryContainer)
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(horizontal = 16.dp))
                CourseGradeItem("ENG 210 — Technical Writing", "Prof. Adams • 3 Credits", "B+", "87.5%", Icons.Default.HistoryEdu, MaterialTheme.colorScheme.tertiary)
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(horizontal = 16.dp))
                CourseGradeItem("PHYS 201 — General Physics II", "Prof. Lee • 4 Credits", "A", "94.1%", Icons.Default.Science, MaterialTheme.colorScheme.secondary)
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(horizontal = 16.dp))
                CourseGradeItem("CS 310 — Database Systems", "Prof. Nguyen • 3 Credits", "B+", "88.3%", Icons.Default.Storage, MaterialTheme.colorScheme.primaryContainer)
            }
        }

        // Degree Progress
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Degree Progress", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(16.dp))
                ProgressItem("Core Requirements", "32/40 credits", 0.80f, MaterialTheme.colorScheme.secondary)
                Spacer(Modifier.height(12.dp))
                ProgressItem("Electives", "18/24 credits", 0.75f, MaterialTheme.colorScheme.primaryContainer)
                Spacer(Modifier.height(12.dp))
                ProgressItem("General Ed", "46/56 credits", 0.82f, MaterialTheme.colorScheme.tertiary)
            }
        }

        // Upcoming Deadlines
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("Upcoming Deadlines", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(16.dp))
                DeadlineItem("BST Assignment", "Due Friday, 11:59 PM", Icons.AutoMirrored.Filled.Assignment, Color(0xFFEF4444))
                Spacer(Modifier.height(12.dp))
                DeadlineItem("Physics Lab Quiz", "Due Monday, 9:00 AM", Icons.Default.Quiz, Color(0xFFF59E0B))
                Spacer(Modifier.height(12.dp))
                DeadlineItem("Technical Report Draft", "Due next Wednesday", Icons.Default.Description, Color(0xFF3B82F6))
            }
        }

        Spacer(Modifier.height(80.dp)) // bottom nav padding
    }
}

@Composable
private fun KpiCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    value: String,
    label: String,
    badge: String? = null,
    modifier: Modifier = Modifier,
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Icon(icon, contentDescription = null, tint = iconTint)
                if (badge != null) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFDCFCE7),
                    ) {
                        Text(badge, modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp), color = Color(0xFF15803D), fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
            Spacer(Modifier.height(8.dp))
            Text(value, style = MaterialTheme.typography.displayMedium, fontWeight = FontWeight.Bold, fontSize = 28.sp)
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun CourseGradeItem(
    title: String,
    subtitle: String,
    grade: String,
    percentage: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Surface(
            modifier = Modifier.size(40.dp),
            shape = RoundedCornerShape(8.dp),
            color = iconTint.copy(alpha = 0.1f),
        ) {
            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                Icon(icon, contentDescription = null, tint = iconTint, modifier = Modifier.size(20.dp))
            }
        }
        Spacer(Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.labelMedium, maxLines = 1)
            Text(subtitle, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Column(horizontalAlignment = Alignment.End) {
            Text(grade, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
            Text(percentage, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun ProgressItem(label: String, detail: String, progress: Float, color: Color) {
    Column {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(detail, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Medium)
        }
        Spacer(Modifier.height(4.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
            color = color,
            trackColor = MaterialTheme.colorScheme.surfaceContainer,
            strokeCap = StrokeCap.Round,
        )
    }
}

@Composable
private fun DeadlineItem(
    title: String,
    due: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
) {
    Row(verticalAlignment = Alignment.Top) {
        Surface(
            modifier = Modifier.size(32.dp),
            shape = RoundedCornerShape(8.dp),
            color = color.copy(alpha = 0.1f),
        ) {
            Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(18.dp))
            }
        }
        Spacer(Modifier.width(12.dp))
        Column {
            Text(title, style = MaterialTheme.typography.labelMedium)
            Text(due, style = MaterialTheme.typography.labelSmall, color = color)
        }
    }
}
