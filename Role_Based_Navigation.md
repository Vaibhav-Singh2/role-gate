**Role Based Navigation System** _React / Angular_ 

# **PROBLEM STATEMENT** 

Create a dynamic sidebar controlled by permissions. 

# **API RESPONSE** 

```
{
  "modules": [
    {
      "name": "Orders",
      "permission": ["VIEW", "CREATE"]
    },
    {
      "name": "Billing",
      "permission": ["VIEW"]
    }
  ]
}
```

# **REQUIREMENTS** 

- Generate sidebar dynamically 

- Hide unauthorized modules 

- Route protection 

- Permission based buttons 

# **EXAMPLE** 

- User A sees Billing 

- User B doesn't 

# **TESTS** 

- Routing knowledge 

- Guards 

- Auth flow 

- State management 

