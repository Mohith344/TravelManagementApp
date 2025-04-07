package com.example.travelmanagementapp.DTO;

    import javax.validation.constraints.NotBlank;
    import javax.validation.constraints.NotNull;
    import javax.validation.constraints.Positive;

    public class ServiceProviderDTO {
        private Long id;

        @NotBlank(message = "Name is mandatory")
        private String name;

        @NotBlank(message = "Service type is mandatory")
        private String serviceType;

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

        public String getServiceType() {
            return serviceType;
        }

        public void setServiceType(String serviceType) {
            this.serviceType = serviceType;
        }
    }