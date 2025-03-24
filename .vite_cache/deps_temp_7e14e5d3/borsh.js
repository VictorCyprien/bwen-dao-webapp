import "./chunk-MVEJMUOB.js";

// node_modules/borsh/lib/esm/types.js
var integers = ["u8", "u16", "u32", "u64", "u128", "i8", "i16", "i32", "i64", "i128", "f32", "f64"];

// node_modules/borsh/lib/esm/buffer.js
var EncodeBuffer = (
  /** @class */
  function() {
    function EncodeBuffer2() {
      this.offset = 0;
      this.buffer_size = 256;
      this.buffer = new ArrayBuffer(this.buffer_size);
      this.view = new DataView(this.buffer);
    }
    EncodeBuffer2.prototype.resize_if_necessary = function(needed_space) {
      if (this.buffer_size - this.offset < needed_space) {
        this.buffer_size = Math.max(this.buffer_size * 2, this.buffer_size + needed_space);
        var new_buffer = new ArrayBuffer(this.buffer_size);
        new Uint8Array(new_buffer).set(new Uint8Array(this.buffer));
        this.buffer = new_buffer;
        this.view = new DataView(new_buffer);
      }
    };
    EncodeBuffer2.prototype.get_used_buffer = function() {
      return new Uint8Array(this.buffer).slice(0, this.offset);
    };
    EncodeBuffer2.prototype.store_value = function(value, type) {
      var bSize = type.substring(1);
      var size = parseInt(bSize) / 8;
      this.resize_if_necessary(size);
      var toCall = type[0] === "f" ? "setFloat".concat(bSize) : type[0] === "i" ? "setInt".concat(bSize) : "setUint".concat(bSize);
      this.view[toCall](this.offset, value, true);
      this.offset += size;
    };
    EncodeBuffer2.prototype.store_bytes = function(from) {
      this.resize_if_necessary(from.length);
      new Uint8Array(this.buffer).set(new Uint8Array(from), this.offset);
      this.offset += from.length;
    };
    return EncodeBuffer2;
  }()
);
var DecodeBuffer = (
  /** @class */
  function() {
    function DecodeBuffer2(buf) {
      this.offset = 0;
      this.buffer_size = buf.length;
      this.buffer = new ArrayBuffer(buf.length);
      new Uint8Array(this.buffer).set(buf);
      this.view = new DataView(this.buffer);
    }
    DecodeBuffer2.prototype.assert_enough_buffer = function(size) {
      if (this.offset + size > this.buffer.byteLength) {
        throw new Error("Error in schema, the buffer is smaller than expected");
      }
    };
    DecodeBuffer2.prototype.consume_value = function(type) {
      var bSize = type.substring(1);
      var size = parseInt(bSize) / 8;
      this.assert_enough_buffer(size);
      var toCall = type[0] === "f" ? "getFloat".concat(bSize) : type[0] === "i" ? "getInt".concat(bSize) : "getUint".concat(bSize);
      var ret = this.view[toCall](this.offset, true);
      this.offset += size;
      return ret;
    };
    DecodeBuffer2.prototype.consume_bytes = function(size) {
      this.assert_enough_buffer(size);
      var ret = this.buffer.slice(this.offset, this.offset + size);
      this.offset += size;
      return ret;
    };
    return DecodeBuffer2;
  }()
);

// node_modules/borsh/lib/esm/utils.js
var __extends = /* @__PURE__ */ function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
function isArrayLike(value) {
  return Array.isArray(value) || !!value && typeof value === "object" && "length" in value && typeof value.length === "number" && (value.length === 0 || value.length > 0 && value.length - 1 in value);
}
function expect_type(value, type, fieldPath) {
  if (typeof value !== type) {
    throw new Error("Expected ".concat(type, " not ").concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
function expect_bigint(value, fieldPath) {
  var basicType = ["number", "string", "bigint", "boolean"].includes(typeof value);
  var strObject = typeof value === "object" && value !== null && "toString" in value;
  if (!basicType && !strObject) {
    throw new Error("Expected bigint, number, boolean or string not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
function expect_same_size(length, expected, fieldPath) {
  if (length !== expected) {
    throw new Error("Array length ".concat(length, " does not match schema length ").concat(expected, " at ").concat(fieldPath.join(".")));
  }
}
function expect_enum(value, fieldPath) {
  if (typeof value !== "object" || value === null) {
    throw new Error("Expected object not ".concat(typeof value, "(").concat(value, ") at ").concat(fieldPath.join(".")));
  }
}
var VALID_STRING_TYPES = integers.concat(["bool", "string"]);
var VALID_OBJECT_KEYS = ["option", "enum", "array", "set", "map", "struct"];
var ErrorSchema = (
  /** @class */
  function(_super) {
    __extends(ErrorSchema2, _super);
    function ErrorSchema2(schema, expected) {
      var message = "Invalid schema: ".concat(JSON.stringify(schema), " expected ").concat(expected);
      return _super.call(this, message) || this;
    }
    return ErrorSchema2;
  }(Error)
);
function validate_schema(schema) {
  if (typeof schema === "string" && VALID_STRING_TYPES.includes(schema)) {
    return;
  }
  if (schema && typeof schema === "object") {
    var keys = Object.keys(schema);
    if (keys.length === 1 && VALID_OBJECT_KEYS.includes(keys[0])) {
      var key = keys[0];
      if (key === "option")
        return validate_schema(schema[key]);
      if (key === "enum")
        return validate_enum_schema(schema[key]);
      if (key === "array")
        return validate_array_schema(schema[key]);
      if (key === "set")
        return validate_schema(schema[key]);
      if (key === "map")
        return validate_map_schema(schema[key]);
      if (key === "struct")
        return validate_struct_schema(schema[key]);
    }
  }
  throw new ErrorSchema(schema, VALID_OBJECT_KEYS.join(", ") + " or " + VALID_STRING_TYPES.join(", "));
}
function validate_enum_schema(schema) {
  if (!Array.isArray(schema))
    throw new ErrorSchema(schema, "Array");
  for (var _i = 0, schema_1 = schema; _i < schema_1.length; _i++) {
    var sch = schema_1[_i];
    if (typeof sch !== "object" || !("struct" in sch)) {
      throw new Error('Missing "struct" key in enum schema');
    }
    if (typeof sch.struct !== "object" || Object.keys(sch.struct).length !== 1) {
      throw new Error('The "struct" in each enum must have a single key');
    }
    validate_schema({ struct: sch.struct });
  }
}
function validate_array_schema(schema) {
  if (typeof schema !== "object")
    throw new ErrorSchema(schema, "{ type, len? }");
  if (schema.len && typeof schema.len !== "number") {
    throw new Error("Invalid schema: ".concat(schema));
  }
  if ("type" in schema)
    return validate_schema(schema.type);
  throw new ErrorSchema(schema, "{ type, len? }");
}
function validate_map_schema(schema) {
  if (typeof schema === "object" && "key" in schema && "value" in schema) {
    validate_schema(schema.key);
    validate_schema(schema.value);
  } else {
    throw new ErrorSchema(schema, "{ key, value }");
  }
}
function validate_struct_schema(schema) {
  if (typeof schema !== "object")
    throw new ErrorSchema(schema, "object");
  for (var key in schema) {
    validate_schema(schema[key]);
  }
}

// node_modules/borsh/lib/esm/serialize.js
var BorshSerializer = (
  /** @class */
  function() {
    function BorshSerializer2(checkTypes) {
      this.encoded = new EncodeBuffer();
      this.fieldPath = ["value"];
      this.checkTypes = checkTypes;
    }
    BorshSerializer2.prototype.encode = function(value, schema) {
      this.encode_value(value, schema);
      return this.encoded.get_used_buffer();
    };
    BorshSerializer2.prototype.encode_value = function(value, schema) {
      if (typeof schema === "string") {
        if (integers.includes(schema))
          return this.encode_integer(value, schema);
        if (schema === "string")
          return this.encode_string(value);
        if (schema === "bool")
          return this.encode_boolean(value);
      }
      if (typeof schema === "object") {
        if ("option" in schema)
          return this.encode_option(value, schema);
        if ("enum" in schema)
          return this.encode_enum(value, schema);
        if ("array" in schema)
          return this.encode_array(value, schema);
        if ("set" in schema)
          return this.encode_set(value, schema);
        if ("map" in schema)
          return this.encode_map(value, schema);
        if ("struct" in schema)
          return this.encode_struct(value, schema);
      }
    };
    BorshSerializer2.prototype.encode_integer = function(value, schema) {
      var size = parseInt(schema.substring(1));
      if (size <= 32 || schema == "f64") {
        this.checkTypes && expect_type(value, "number", this.fieldPath);
        this.encoded.store_value(value, schema);
      } else {
        this.checkTypes && expect_bigint(value, this.fieldPath);
        this.encode_bigint(BigInt(value), size);
      }
    };
    BorshSerializer2.prototype.encode_bigint = function(value, size) {
      var buffer_len = size / 8;
      var buffer = new Uint8Array(buffer_len);
      for (var i = 0; i < buffer_len; i++) {
        buffer[i] = Number(value & BigInt(255));
        value = value >> BigInt(8);
      }
      this.encoded.store_bytes(new Uint8Array(buffer));
    };
    BorshSerializer2.prototype.encode_string = function(value) {
      this.checkTypes && expect_type(value, "string", this.fieldPath);
      var _value = value;
      var utf8Bytes = [];
      for (var i = 0; i < _value.length; i++) {
        var charCode = _value.charCodeAt(i);
        if (charCode < 128) {
          utf8Bytes.push(charCode);
        } else if (charCode < 2048) {
          utf8Bytes.push(192 | charCode >> 6, 128 | charCode & 63);
        } else if (charCode < 55296 || charCode >= 57344) {
          utf8Bytes.push(224 | charCode >> 12, 128 | charCode >> 6 & 63, 128 | charCode & 63);
        } else {
          i++;
          charCode = 65536 + ((charCode & 1023) << 10 | _value.charCodeAt(i) & 1023);
          utf8Bytes.push(240 | charCode >> 18, 128 | charCode >> 12 & 63, 128 | charCode >> 6 & 63, 128 | charCode & 63);
        }
      }
      this.encoded.store_value(utf8Bytes.length, "u32");
      this.encoded.store_bytes(new Uint8Array(utf8Bytes));
    };
    BorshSerializer2.prototype.encode_boolean = function(value) {
      this.checkTypes && expect_type(value, "boolean", this.fieldPath);
      this.encoded.store_value(value ? 1 : 0, "u8");
    };
    BorshSerializer2.prototype.encode_option = function(value, schema) {
      if (value === null || value === void 0) {
        this.encoded.store_value(0, "u8");
      } else {
        this.encoded.store_value(1, "u8");
        this.encode_value(value, schema.option);
      }
    };
    BorshSerializer2.prototype.encode_enum = function(value, schema) {
      this.checkTypes && expect_enum(value, this.fieldPath);
      var valueKey = Object.keys(value)[0];
      for (var i = 0; i < schema["enum"].length; i++) {
        var valueSchema = schema["enum"][i];
        if (valueKey === Object.keys(valueSchema.struct)[0]) {
          this.encoded.store_value(i, "u8");
          return this.encode_struct(value, valueSchema);
        }
      }
      throw new Error("Enum key (".concat(valueKey, ") not found in enum schema: ").concat(JSON.stringify(schema), " at ").concat(this.fieldPath.join(".")));
    };
    BorshSerializer2.prototype.encode_array = function(value, schema) {
      if (isArrayLike(value))
        return this.encode_arraylike(value, schema);
      if (value instanceof ArrayBuffer)
        return this.encode_buffer(value, schema);
      throw new Error("Expected Array-like not ".concat(typeof value, "(").concat(value, ") at ").concat(this.fieldPath.join(".")));
    };
    BorshSerializer2.prototype.encode_arraylike = function(value, schema) {
      if (schema.array.len) {
        expect_same_size(value.length, schema.array.len, this.fieldPath);
      } else {
        this.encoded.store_value(value.length, "u32");
      }
      for (var i = 0; i < value.length; i++) {
        this.encode_value(value[i], schema.array.type);
      }
    };
    BorshSerializer2.prototype.encode_buffer = function(value, schema) {
      if (schema.array.len) {
        expect_same_size(value.byteLength, schema.array.len, this.fieldPath);
      } else {
        this.encoded.store_value(value.byteLength, "u32");
      }
      this.encoded.store_bytes(new Uint8Array(value));
    };
    BorshSerializer2.prototype.encode_set = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      var isSet = value instanceof Set;
      var values = isSet ? Array.from(value.values()) : Object.values(value);
      this.encoded.store_value(values.length, "u32");
      for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var value_1 = values_1[_i];
        this.encode_value(value_1, schema.set);
      }
    };
    BorshSerializer2.prototype.encode_map = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      var isMap = value instanceof Map;
      var keys = isMap ? Array.from(value.keys()) : Object.keys(value);
      this.encoded.store_value(keys.length, "u32");
      for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        this.encode_value(key, schema.map.key);
        this.encode_value(isMap ? value.get(key) : value[key], schema.map.value);
      }
    };
    BorshSerializer2.prototype.encode_struct = function(value, schema) {
      this.checkTypes && expect_type(value, "object", this.fieldPath);
      for (var _i = 0, _a = Object.keys(schema.struct); _i < _a.length; _i++) {
        var key = _a[_i];
        this.fieldPath.push(key);
        this.encode_value(value[key], schema.struct[key]);
        this.fieldPath.pop();
      }
    };
    return BorshSerializer2;
  }()
);

// node_modules/borsh/lib/esm/deserialize.js
var BorshDeserializer = (
  /** @class */
  function() {
    function BorshDeserializer2(bufferArray) {
      this.buffer = new DecodeBuffer(bufferArray);
    }
    BorshDeserializer2.prototype.decode = function(schema) {
      return this.decode_value(schema);
    };
    BorshDeserializer2.prototype.decode_value = function(schema) {
      if (typeof schema === "string") {
        if (integers.includes(schema))
          return this.decode_integer(schema);
        if (schema === "string")
          return this.decode_string();
        if (schema === "bool")
          return this.decode_boolean();
      }
      if (typeof schema === "object") {
        if ("option" in schema)
          return this.decode_option(schema);
        if ("enum" in schema)
          return this.decode_enum(schema);
        if ("array" in schema)
          return this.decode_array(schema);
        if ("set" in schema)
          return this.decode_set(schema);
        if ("map" in schema)
          return this.decode_map(schema);
        if ("struct" in schema)
          return this.decode_struct(schema);
      }
      throw new Error("Unsupported type: ".concat(schema));
    };
    BorshDeserializer2.prototype.decode_integer = function(schema) {
      var size = parseInt(schema.substring(1));
      if (size <= 32 || schema == "f64") {
        return this.buffer.consume_value(schema);
      }
      return this.decode_bigint(size, schema.startsWith("i"));
    };
    BorshDeserializer2.prototype.decode_bigint = function(size, signed) {
      if (signed === void 0) {
        signed = false;
      }
      var buffer_len = size / 8;
      var buffer = new Uint8Array(this.buffer.consume_bytes(buffer_len));
      var bits = buffer.reduceRight(function(r, x) {
        return r + x.toString(16).padStart(2, "0");
      }, "");
      if (signed && buffer[buffer_len - 1]) {
        return BigInt.asIntN(size, BigInt("0x".concat(bits)));
      }
      return BigInt("0x".concat(bits));
    };
    BorshDeserializer2.prototype.decode_string = function() {
      var len = this.decode_integer("u32");
      var buffer = new Uint8Array(this.buffer.consume_bytes(len));
      var codePoints = [];
      for (var i = 0; i < len; ++i) {
        var byte = buffer[i];
        if (byte < 128) {
          codePoints.push(byte);
        } else if (byte < 224) {
          codePoints.push((byte & 31) << 6 | buffer[++i] & 63);
        } else if (byte < 240) {
          codePoints.push((byte & 15) << 12 | (buffer[++i] & 63) << 6 | buffer[++i] & 63);
        } else {
          var codePoint = (byte & 7) << 18 | (buffer[++i] & 63) << 12 | (buffer[++i] & 63) << 6 | buffer[++i] & 63;
          codePoints.push(codePoint);
        }
      }
      return String.fromCodePoint.apply(String, codePoints);
    };
    BorshDeserializer2.prototype.decode_boolean = function() {
      return this.buffer.consume_value("u8") > 0;
    };
    BorshDeserializer2.prototype.decode_option = function(schema) {
      var option = this.buffer.consume_value("u8");
      if (option === 1) {
        return this.decode_value(schema.option);
      }
      if (option !== 0) {
        throw new Error("Invalid option ".concat(option));
      }
      return null;
    };
    BorshDeserializer2.prototype.decode_enum = function(schema) {
      var _a;
      var valueIndex = this.buffer.consume_value("u8");
      if (valueIndex > schema["enum"].length) {
        throw new Error("Enum option ".concat(valueIndex, " is not available"));
      }
      var struct = schema["enum"][valueIndex].struct;
      var key = Object.keys(struct)[0];
      return _a = {}, _a[key] = this.decode_value(struct[key]), _a;
    };
    BorshDeserializer2.prototype.decode_array = function(schema) {
      var result = [];
      var len = schema.array.len ? schema.array.len : this.decode_integer("u32");
      for (var i = 0; i < len; ++i) {
        result.push(this.decode_value(schema.array.type));
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_set = function(schema) {
      var len = this.decode_integer("u32");
      var result = /* @__PURE__ */ new Set();
      for (var i = 0; i < len; ++i) {
        result.add(this.decode_value(schema.set));
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_map = function(schema) {
      var len = this.decode_integer("u32");
      var result = /* @__PURE__ */ new Map();
      for (var i = 0; i < len; ++i) {
        var key = this.decode_value(schema.map.key);
        var value = this.decode_value(schema.map.value);
        result.set(key, value);
      }
      return result;
    };
    BorshDeserializer2.prototype.decode_struct = function(schema) {
      var result = {};
      for (var key in schema.struct) {
        result[key] = this.decode_value(schema.struct[key]);
      }
      return result;
    };
    return BorshDeserializer2;
  }()
);

// node_modules/borsh/lib/esm/index.js
function serialize(schema, value, validate) {
  if (validate === void 0) {
    validate = true;
  }
  if (validate)
    validate_schema(schema);
  var serializer = new BorshSerializer(validate);
  return serializer.encode(value, schema);
}
function deserialize(schema, buffer, validate) {
  if (validate === void 0) {
    validate = true;
  }
  if (validate)
    validate_schema(schema);
  var deserializer = new BorshDeserializer(buffer);
  return deserializer.decode(schema);
}
export {
  deserialize,
  serialize
};
//# sourceMappingURL=borsh.js.map
