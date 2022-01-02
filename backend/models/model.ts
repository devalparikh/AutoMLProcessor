import mongoose from "mongoose";

// An interface that describes the properties that are required to create a new model
interface ModelAttrs {
  owner: string;
  endpoint: string;
  trainedModel: string;
  training: boolean;
  config: object;
  results: object;
}

// An interface that describes the properties that an user model has
interface Model extends mongoose.Model<ModelDoc> {
  build(attrs: ModelAttrs): ModelDoc;
}

// An interface that describes the properties that a User Document has
interface ModelDoc extends mongoose.Document {
  owner: string;
  endpoint: string;
  trainedModel: string;
  training: boolean;
  config: object;
  results: object;
}

const modelSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    endpoint: {
      type: String,
      required: false,
    },
    trainedModel: {
      type: String,
      required: false,
    },
    training: {
      type: Boolean,
      required: false,
    },
    config: {
      type: Object,
      required: true,
    },
    results: {
      type: Object,
      required: true,
    },
  },
  {
    toJSON: {
      // Reformat database schema upon retrieval
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

modelSchema.statics.build = (attrs: ModelAttrs) => {
  return new Model(attrs);
};

const Model = mongoose.model<ModelDoc, Model>("Model", modelSchema);

export { Model };
