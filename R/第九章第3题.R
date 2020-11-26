x <- c(1, 2, -1, 0, -1, 1, 2, 3, 2, 3, -1, 2, 1)
y <- c(0, 2, 1, 1, -1, 2, 3, 2, 3, 3, 0, 2, 2)
spearman.test(rank(x), rank(y), approximation = "AS89")