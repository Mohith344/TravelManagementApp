package com.example.travelmanagementapp.DTO;

    import javax.validation.constraints.NotBlank;
    import javax.validation.constraints.Positive;

    public class TravelPackageDTO {
        private Long id;

        @NotBlank(message = "Name is mandatory")
        private String name;

        @NotBlank(message = "Description is mandatory")
        private String description;

        @Positive(message = "Price must be positive")
        private double price;

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }