import numpy as np
import pandas as pd
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from PIL import Image
import PIL.ImageOps

x, y = fetch_openml('mnist_784', version=1, return_X_y=True)

xtr, xte, ytr, yte = train_test_split(
    x, y, random_state=9, train_size=7500, test_size=2500)

clf = LogisticRegression(solver='saga', multi_class='multinomial').fit(
    xtr / 255.0, ytr)


def get_prediction(image):
  img = Image.open(image)
  img = img.convert('L')
  img = img.resize((28, 28), Image.ANTIALIAS)
  pixel_filter = 20
  min_pixel = np.percentile(img, pixel_filter)
  max_pixel = np.max(img)
  img = np.clip(
      img - min_pixel, 0, 255)
  img = np.asarray(
      img) / max_pixel
  test_sample = np.array(img).reshape(1, 784)
  test_pred = clf.predict(test_sample)
  return test_pred[0]
