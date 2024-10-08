# -*- coding: utf-8 -*-
"""ADVexpt4.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1o-E97VTFcVyj6k62XMcwrxbwfYJqQhdO
"""

install.packages("ggplot2")
install.packages("dplyr")
library(ggplot2)
library(dplyr)

df <- read.csv("crime.csv")
df <- df %>% na.omit()

str(df)

#sample 100 entries from dataset for cleaner chart
df_sample <- df %>%
  sample_n(100)

# Bar chart showing the number of crimes per district
df_sample %>%
  group_by(DISTRICT) %>%
  summarise(count = n()) %>%
  ggplot(aes(x = DISTRICT, y = count)) +
  geom_bar(stat = "identity", fill = "steelblue") +
  labs(title = "Number of Crimes per District", x = "District", y = "Number of Crimes") +
  theme_minimal()

# Pie chart showing the proportion of crime types
df_sample %>%
  count(OFFENSE_CODE_GROUP) %>%
  ggplot(aes(x = "", y = n, fill = OFFENSE_CODE_GROUP)) +
  geom_bar(stat = "identity", width = 1) +
  coord_polar(theta = "y") +
  labs(title = "Proportion of Crime Types")

# Summarize the data to count the number of crimes per offense code group
crime_summary <- df_sample %>%
  count(OFFENSE_CODE_GROUP) %>%
  arrange(desc(n))

labels <- paste(crime_summary$OFFENSE_CODE_GROUP, "(", crime_summary$n, ")")

pie(crime_summary$n, labels = labels,
    main = "Proportion of Crime Types",
    col = rainbow(length(crime_summary$n)))

# Histogram showing the distribution of crimes by hour of the day
ggplot(df_sample, aes(x = HOUR)) +
  geom_histogram(binwidth = 1, fill = "tomato", color = "black") +
  labs(title = "Distribution of Crimes by Hour", x = "Hour", y = "Count of Crimes") +
  theme_minimal()

# Ensure the date column is in date format
df_sample$OCCURRED_ON_DATE <- as.Date(df_sample$OCCURRED_ON_DATE)

crime_trend <- df_sample %>%
  group_by(OCCURRED_ON_DATE) %>%
  summarise(Crime_Count = n())  # Count the number of crimes per day

head(crime_trend)

ggplot(crime_trend, aes(x = OCCURRED_ON_DATE, y = Crime_Count)) +
  geom_line(color = "blue") +  # Line plot to show trend over time
  ggtitle("Trend of Crimes Over Time") +
  xlab("Date") +
  ylab("Number of Crimes") +
  theme_minimal()  # Use a clean, minimal theme

# Bubble plot showing the number of crimes per offense group and district
df_sample %>%
  group_by(OFFENSE_CODE_GROUP, DAY_OF_WEEK) %>%
  summarise(count = n()) %>%
  ggplot(aes(x =  DAY_OF_WEEK, y = OFFENSE_CODE_GROUP, size = count, color = count)) +
  geom_point(alpha = 0.7) +
  scale_size(range = c(3, 20)) +
  labs(title = "Crime Incidents by Offense Group on the week day", x = "DAY_OF_WEEK", y = "Offense Code Group") +
  theme_minimal()

# Group the sampled data by hour and count the number of incidents
hourly_incidents <- df_sample %>%
  group_by(HOUR) %>%
  summarise(incident_count = n())  # Count the number of incidents per hour

# Check the structure of the data
print(hourly_incidents)

ggplot(hourly_incidents, aes(x = incident_count, y = HOUR)) +
  geom_point(color = "blue", size = 3) +  # Scatter plot points
  labs(title = "Scatter Plot of Number of Incidents vs. Hours",
       x = "Number of Incidents",
       y = "Hour of the Day") +
  theme_minimal()