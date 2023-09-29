from app.extension import db

class Tasks(db.Model):
    task_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String(64), nullable=False)
    description = db.Column(db.String(1024))
    status = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.project_id'))
    # untuk mendefine relationship, supaya data yg berhubungan muncul satu sama lain
    user = db.relationship('Users',back_populates = 'task')
    project = db.relationship('Projects',back_populates = 'task')

    # serialize agar datanya kembali ke bentuk object/dictionary
    def serialize(self):
        return{
            "task_id":self.task_id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "user_id": self.user_id,
            "project_id": self.project_id
        }