package com.example.travelmanagementapp.DTO;

            import javax.validation.constraints.NotBlank;
            import javax.validation.constraints.NotNull;
            import javax.validation.constraints.Positive;

            public class TransportationDTO {
                private Long id;

                @NotBlank(message = "Type is mandatory")
                private String type;

                @NotBlank(message = "Details are mandatory")
                private String details;

                @Positive(message = "Price must be positive")
                private double price;

                // Getters and Setters
                public Long getId() {
                    return id;
                }

                public void setId(Long id) {
                    this.id = id;
                }

                public String getType() {
                    return type;
                }

                public void setType(String type) {
                    this.type = type;
                }

                public String getDetails() {
                    return details;
                }

                public void setDetails(String details) {
                    this.details = details;
                }

                public double getPrice() {
                    return price;
                }

                public void setPrice(double price) {
                    this.price = price;
                }
            }