export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "SecureBankito API",
    version: "1.0.0",
    description: `
Manual técnico OpenAPI/Swagger para la PoC de Sistema Bancario Seguro con DDD.

El sistema está dividido en tres dominios:
- IAM: Gestión de usuarios, credenciales y emisión de JWT con etiquetas de seguridad.
- BankingCore: Gestión de cuentas bancarias y transacciones con validación Biba.
- VIP Assets: Gestión de activos de inversión de nivel Oro con validación Bell-LaPadula.

Equivalencia de niveles usada en esta implementación:
- BRONZE = Bronce
- SILVER = Plata
- PLATINUM = Oro

Reglas demostradas:
- Biba / No Write Up: un proceso de menor integridad no puede modificar datos de mayor integridad.
- Bell-LaPadula / No Read Up: un usuario de menor clearance no puede leer activos de mayor confidencialidad.
`,
  },
  servers: [
    {
      url: "http://localhost:3003",
      description: "API Gateway local sobre Minikube",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Endpoints de verificación de disponibilidad de los microservicios.",
    },
    {
      name: "IAM",
      description: "Dominio de Identidad y Acceso. Gestiona usuarios, credenciales, clearance e integrity level.",
    },
    {
      name: "BankingCore",
      description: "Dominio bancario. Gestiona cuentas y transacciones aplicando Biba.",
    },
    {
      name: "VIP Assets",
      description: "Dominio de inversiones VIP. Protege activos Oro aplicando Bell-LaPadula.",
    },
    {
      name: "Demo PoC",
      description: "Escenarios principales de defensa del proyecto.",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT emitido por IAM. En Swagger, pegar solo el token, sin escribir Bearer.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: { type: "string", example: "Missing or invalid authorization header" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["username", "password"],
        properties: {
          username: { type: "string", example: "admin" },
          password: { type: "string", example: "admin123" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "object",
            properties: {
              token: {
                type: "string",
                example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["username", "password", "clearance_level", "integrity_level"],
        properties: {
          username: { type: "string", example: "plata_user" },
          password: { type: "string", example: "Password123" },
          clearance_level: {
            type: "string",
            enum: ["BRONZE", "SILVER", "PLATINUM"],
            example: "SILVER",
            description: "BRONZE = Bronce, SILVER = Plata, PLATINUM = Oro.",
          },
          integrity_level: {
            type: "integer",
            enum: [1, 2, 3],
            example: 2,
            description: "Nivel de integridad del usuario/proceso. 1 = bajo, 3 = alto.",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          username: { type: "string", example: "plata_user" },
          clearance_level: {
            type: "string",
            enum: ["BRONZE", "SILVER", "PLATINUM"],
            example: "SILVER",
          },
          integrity_level: {
            type: "string",
            enum: ["LEVEL_1", "LEVEL_2", "LEVEL_3"],
            example: "LEVEL_2",
          },
        },
      },
      UserResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      UsersListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
      CreateBankAccountRequest: {
        type: "object",
        required: ["owner_uuid", "initial_balance"],
        properties: {
          owner_uuid: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          initial_balance: {
            type: "number",
            example: 1000,
          },
        },
      },
      BankAccount: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          owner_id: { type: "string", format: "uuid" },
          balance: { type: "string", example: "1000.0000" },
        },
      },
      BankAccountResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/BankAccount" },
        },
      },
      BankAccountsListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/BankAccount" },
          },
        },
      },
      CreateTransactionRequest: {
        type: "object",
        required: ["remitter_account_uuid", "receiver_account_uuid", "amount"],
        properties: {
          remitter_account_uuid: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440001",
            description: "Cuenta origen. Para usuarios no admin, debe pertenecer al usuario autenticado.",
          },
          receiver_account_uuid: {
            type: "string",
            format: "uuid",
            example: "550e8400-e29b-41d4-a716-446655440002",
            description: "Cuenta destino.",
          },
          amount: {
            type: "number",
            example: 100,
          },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          remitter_account_id: { type: "string", format: "uuid" },
          receiver_account_id: { type: "string", format: "uuid" },
          amount: { type: "string", example: "100.0000" },
          status: {
            type: "string",
            enum: ["COMPLETED", "REJECTED"],
            example: "COMPLETED",
          },
          rejection_reason: {
            type: "string",
            nullable: true,
            example: null,
          },
          created_at: {
            type: "string",
            example: "2026-06-18T03:00:00.000Z",
          },
        },
      },
      TransactionResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Transaction" },
        },
      },
      BibaViolationResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          data: {
            allOf: [{ $ref: "#/components/schemas/Transaction" }],
            example: {
              id: "550e8400-e29b-41d4-a716-446655440010",
              remitter_account_id: "550e8400-e29b-41d4-a716-446655440001",
              receiver_account_id: "550e8400-e29b-41d4-a716-446655440002",
              amount: "100.0000",
              status: "REJECTED",
              rejection_reason: "Biba violation: requester integrity level 1 is lower than receiver integrity level 3",
              created_at: "2026-06-18T03:00:00.000Z",
            },
          },
        },
      },
      CreateVIPAssetRequest: {
        type: "object",
        required: ["name", "value"],
        properties: {
          name: {
            type: "string",
            example: "Fondo Privado Oro",
          },
          value: {
            type: "number",
            example: 500000,
          },
        },
      },
      VIPAsset: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Fondo Privado Oro" },
          value: { type: "string", example: "500000.0000" },
        },
      },
      VIPAssetResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/VIPAsset" },
        },
      },
      VIPAssetsListResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/VIPAsset" },
          },
        },
      },
      BellLaPadulaViolationResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          error: {
            type: "string",
            example: "Bell-LaPadula violation: No Read Up - PLATINUM clearance required",
          },
        },
      },
    },
  },
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Ruta raíz no implementada",
        description: "Esta ruta se documenta para aclarar que el API Gateway no expone una interfaz en /.",
        responses: {
          404: {
            description: "Ruta no encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: {
                  success: false,
                  error: "Route GET / not found",
                },
              },
            },
          },
        },
      },
    },

    "/iam/": {
      get: {
        tags: ["Health"],
        summary: "Verificar servicio IAM",
        responses: {
          200: {
            description: "IAM activo",
            content: {
              "text/plain": {
                schema: { type: "string", example: "IAM Service running" },
              },
            },
          },
        },
      },
    },

    "/banking/": {
      get: {
        tags: ["Health"],
        summary: "Verificar servicio BankingCore",
        responses: {
          200: {
            description: "BankingCore activo",
            content: {
              "text/plain": {
                schema: { type: "string", example: "BankingCore Service running" },
              },
            },
          },
        },
      },
    },

    "/vip/": {
      get: {
        tags: ["Health"],
        summary: "Verificar servicio VIP Assets",
        responses: {
          200: {
            description: "VIP Assets activo",
            content: {
              "text/plain": {
                schema: { type: "string", example: "VIPAssets Service running" },
              },
            },
          },
        },
      },
    },

    "/iam/auth/login": {
      post: {
        tags: ["IAM", "Demo PoC"],
        summary: "Iniciar sesión y obtener JWT",
        description: "El token emitido contiene las etiquetas de seguridad del usuario: clearance_level, integrity_level y role.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
              examples: {
                admin: {
                  summary: "Login de usuario admin",
                  value: {
                    username: "admin",
                    password: "admin123",
                  },
                },
                bronce: {
                  summary: "Login de usuario Bronce",
                  value: {
                    username: "bronce_user",
                    password: "Password123",
                  },
                },
                plata: {
                  summary: "Login de usuario Plata",
                  value: {
                    username: "plata_user",
                    password: "Password123",
                  },
                },
                oro: {
                  summary: "Login de usuario Oro",
                  value: {
                    username: "oro_user",
                    password: "Password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login exitoso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          422: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          500: {
            description: "Usuario o credenciales inválidas según la lógica actual del servicio",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/iam/users": {
      get: {
        tags: ["IAM"],
        summary: "Listar usuarios",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de usuarios",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UsersListResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
                example: { success: false, error: "Admin access required" },
              },
            },
          },
        },
      },
      post: {
        tags: ["IAM"],
        summary: "Crear usuario",
        description: "Crea un usuario con clearance e integrity level. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateUserRequest" },
              examples: {
                bronce: {
                  summary: "Usuario Bronce / integridad 1",
                  value: {
                    username: "bronce_user",
                    password: "Password123",
                    clearance_level: "BRONZE",
                    integrity_level: 1,
                  },
                },
                plata: {
                  summary: "Usuario Plata / integridad 2",
                  value: {
                    username: "plata_user",
                    password: "Password123",
                    clearance_level: "SILVER",
                    integrity_level: 2,
                  },
                },
                oro: {
                  summary: "Usuario Oro / integridad 3",
                  value: {
                    username: "oro_user",
                    password: "Password123",
                    clearance_level: "PLATINUM",
                    integrity_level: 3,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuario creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/iam/users/{id}": {
      get: {
        tags: ["IAM"],
        summary: "Obtener usuario por ID",
        description: "Requiere usuario autenticado. Se usa también para que BankingCore consulte las etiquetas de seguridad del dueño de una cuenta durante la validación Biba.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Usuario encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Formato de ID inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/banking/bank-accounts": {
      get: {
        tags: ["BankingCore"],
        summary: "Listar cuentas bancarias",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de cuentas bancarias",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BankAccountsListResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["BankingCore"],
        summary: "Crear cuenta bancaria",
        description: "Crea una cuenta bancaria asociada a un usuario. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBankAccountRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Cuenta creada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BankAccountResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/banking/bank-accounts/{id}": {
      get: {
        tags: ["BankingCore"],
        summary: "Obtener cuenta bancaria por ID",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Cuenta encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BankAccountResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Formato de ID inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/banking/bank-accounts/owner/{ownerId}": {
      get: {
        tags: ["BankingCore"],
        summary: "Obtener cuenta bancaria por propietario",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "ownerId",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Cuenta encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BankAccountResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Formato de ownerId inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/banking/transactions": {
      get: {
        tags: ["BankingCore"],
        summary: "Listar transacciones",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de transacciones",
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["BankingCore", "Demo PoC"],
        summary: "Crear transacción bancaria",
        description: `
Ejecuta una transferencia entre dos cuentas.

Validación de seguridad:
- Se aplica Biba / No Write Up.
- Si el usuario/proceso autenticado tiene menor integridad que el receptor, la transacción se registra como REJECTED y retorna 403.

Escenario A de demo:
- Usuario Bronce / integrity_level 1 intenta depositar en cuenta asociada a usuario Oro / integrity_level 3.
- Resultado esperado: 403 Forbidden con status REJECTED.
`,
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTransactionRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Transacción completada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          403: {
            description: "Transacción rechazada por Biba o acceso denegado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BibaViolationResponse" },
              },
            },
          },
          422: {
            description: "Datos inválidos o saldo insuficiente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/banking/transactions/{id}": {
      get: {
        tags: ["BankingCore"],
        summary: "Obtener transacción por ID",
        description: "Requiere usuario autenticado con rol ADMIN.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Transacción encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Formato de ID inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/vip/vip-assets": {
      get: {
        tags: ["VIP Assets", "Demo PoC"],
        summary: "Listar activos VIP de nivel Oro",
        description: `
Lista activos de inversión VIP.

Validación de seguridad:
- Se aplica Bell-LaPadula / No Read Up.
- Solo usuarios con clearance Oro pueden listar estos activos.
- En esta implementación, Oro está representado como PLATINUM.

Escenario B de demo:
- Usuario Plata / SILVER intenta listar activos Oro / PLATINUM.
- Resultado esperado: 403 Forbidden.
`,
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de activos VIP",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VIPAssetsListResponse" },
              },
            },
          },
          401: {
            description: "Token faltante o inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Violación Bell-LaPadula / No Read Up",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BellLaPadulaViolationResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["VIP Assets"],
        summary: "Crear activo VIP",
        description: "Crea un activo de inversión VIP. Requiere rol ADMIN.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateVIPAssetRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "Activo VIP creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VIPAssetResponse" },
              },
            },
          },
          403: {
            description: "Acceso admin requerido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          422: {
            description: "Datos inválidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },

    "/vip/vip-assets/{id}": {
      get: {
        tags: ["VIP Assets"],
        summary: "Obtener activo VIP por ID",
        description: "Requiere clearance Oro. En esta implementación, Oro = PLATINUM.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Activo VIP encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/VIPAssetResponse" },
              },
            },
          },
          403: {
            description: "Violación Bell-LaPadula / No Read Up",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BellLaPadulaViolationResponse" },
              },
            },
          },
          422: {
            description: "Formato de ID inválido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};