from app.extension import db

class Projects(db.Model):
    project_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(1024))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    # untuk mendefine relationship, supaya data yg berhubungan muncul satu sama lain
    user = db.relationship('Users',back_populates = 'project')
    task = db.relationship('Tasks',back_populates = 'project')


    # serialize agar datanya kembali ke bentuk object/dictionary
    def serialize(self):
        return{
            "project_id":self.project_id,
            "title": self.title,
            "description": self.description,
            "user_id": self.user_id
        }