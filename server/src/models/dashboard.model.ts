import mongoose, { Schema } from "mongoose";

const widgetSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const dashboardSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    // The narrative the generator wrote for this board. Stored alongside the
    // widgets so a dashboard reloaded from the list reads the same as the one
    // that was just streamed.
    headline: {
      type: String,
      trim: true,
    },

    subtitle: {
      type: String,
      trim: true,
    },

    layout: {
      type: String,
      enum: [
        "grid-2-col",
        "grid-3-col",
        "grid-4-col",
      ],
      required: true,
    },

    theme: {
      type: String,
      enum: [
        "dark",
        "light",
      ],
      required: true,
    },

    widgets: {
      type: [widgetSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const DashboardModel =
  mongoose.model("Dashboard", dashboardSchema);