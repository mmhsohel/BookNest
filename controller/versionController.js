import Version from "../models/Version.js"; //✅ make sure the model file uses `export default`

export const getVersion = async (req, res) => {
  try {
    const latest = await Version.findOne().sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: 'Version info not found' });
    }

    res.status(200).json({
      latestVersion: latest.latestVersion,
      forceUpdate: latest.forceUpdate,
      androidLink: latest.androidLink,
      iosLink: latest.iosLink,
    });
  } catch (error) {
    console.error('Version fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
